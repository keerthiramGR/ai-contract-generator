from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.contract import ContractCategory, ContractTemplate, Contract, ContractVersion, ContractStatus
from app.models.activity import ActivityLog, ContractEvent
from app.schemas.contract import ContractCreate, ContractUpdate, ContractTemplateCreate, ContractTemplateUpdate
import uuid
from typing import List, Optional

class ContractService:
    # ─── Categories ───────────────────────────────────────────────────
    @staticmethod
    async def create_category(db: AsyncSession, name: str, description: Optional[str] = None) -> ContractCategory:
        category = ContractCategory(name=name, description=description)
        db.add(category)
        await db.commit()
        await db.refresh(category)
        return category

    @staticmethod
    async def get_categories(db: AsyncSession) -> List[ContractCategory]:
        result = await db.execute(select(ContractCategory))
        return list(result.scalars().all())

    # ─── Templates ────────────────────────────────────────────────────
    @staticmethod
    async def create_template(db: AsyncSession, company_id: uuid.UUID, creator_id: uuid.UUID, template_in: ContractTemplateCreate) -> ContractTemplate:
        template = ContractTemplate(
            company_id=company_id,
            category_id=template_in.category_id,
            template_name=template_in.template_name,
            template_content=template_in.template_content,
            is_active=template_in.is_active,
            created_by=creator_id
        )
        db.add(template)
        await db.commit()
        await db.refresh(template)
        return template

    @staticmethod
    async def get_templates(db: AsyncSession, company_id: uuid.UUID) -> List[ContractTemplate]:
        result = await db.execute(
            select(ContractTemplate)
            .where(ContractTemplate.company_id == company_id)
            .order_by(ContractTemplate.template_name)
        )
        return list(result.scalars().all())

    # ─── Contracts ────────────────────────────────────────────────────
    @staticmethod
    async def create_contract(db: AsyncSession, user_id: uuid.UUID, contract_in: ContractCreate) -> Contract:
        contract = Contract(
            user_id=user_id,
            company_id=contract_in.company_id,
            template_id=contract_in.template_id,
            title=contract_in.title,
            purpose=contract_in.purpose,
            generated_content=contract_in.generated_content,
            ai_summary=contract_in.ai_summary,
            risk_score=contract_in.risk_score,
            status=contract_in.status or ContractStatus.DRAFT
        )
        db.add(contract)
        await db.flush()
        
        # Log event & activity
        db.add(ContractEvent(contract_id=contract.id, event_type="Created", created_by=user_id))
        db.add(ActivityLog(user_id=user_id, action="CREATE_CONTRACT", module="CONTRACTS"))
        
        # Save initial version
        initial_version = ContractVersion(
            contract_id=contract.id,
            version=1,
            content=contract.generated_content,
            created_by=user_id
        )
        db.add(initial_version)
        
        await db.commit()
        await db.refresh(contract)
        return contract

    @staticmethod
    async def get_contract(db: AsyncSession, contract_id: uuid.UUID) -> Contract:
        result = await db.execute(select(Contract).where(Contract.id == contract_id))
        contract = result.scalar_one_or_none()
        if not contract:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")
        return contract

    @staticmethod
    async def get_contracts_by_user(db: AsyncSession, user_id: uuid.UUID) -> List[Contract]:
        result = await db.execute(
            select(Contract)
            .where(Contract.user_id == user_id)
            .order_by(desc(Contract.created_at))
        )
        return list(result.scalars().all())

    @staticmethod
    async def update_contract(db: AsyncSession, user_id: uuid.UUID, contract_id: uuid.UUID, contract_update: ContractUpdate) -> Contract:
        contract = await ContractService.get_contract(db, contract_id)
        
        # Check if content is modified to version control
        content_changed = (
            contract_update.generated_content is not None and 
            contract_update.generated_content != contract.generated_content
        )
        
        update_dict = contract_update.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(contract, key, value)
            
        if content_changed:
            # Query latest version number
            version_result = await db.execute(
                select(ContractVersion.version)
                .where(ContractVersion.contract_id == contract_id)
                .order_by(desc(ContractVersion.version))
                .limit(1)
            )
            latest_version = version_result.scalar() or 0
            
            # Create new version
            new_version = ContractVersion(
                contract_id=contract_id,
                version=latest_version + 1,
                content=contract.generated_content,
                created_by=user_id
            )
            db.add(new_version)
            
            # Log event
            db.add(ContractEvent(contract_id=contract_id, event_type="Modified", created_by=user_id))
            
        db.add(ActivityLog(user_id=user_id, action="UPDATE_CONTRACT", module="CONTRACTS"))
        await db.commit()
        await db.refresh(contract)
        return contract

    @staticmethod
    async def get_contract_versions(db: AsyncSession, contract_id: uuid.UUID) -> List[ContractVersion]:
        result = await db.execute(
            select(ContractVersion)
            .where(ContractVersion.contract_id == contract_id)
            .order_by(desc(ContractVersion.version))
        )
        return list(result.scalars().all())
