from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.contract import (
    ContractGenerateAIRequest,
    ContractSummarizeRequest,
    ContractImproveRequest,
    ContractRiskAnalysisResponse,
    ClauseGeneratorRequest,
    RewriteClauseRequest,
    ClauseResponse,
    AIChatRequest,
    AIChatResponse,
)
from app.services.ai_service import AIService
from app.services.contract_service import ContractService
from app.core.auth import get_current_user
from app.models.profile import Profile
from app.models.document import AIChatHistory
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/ai", tags=["AI Features"])

@router.post("/generate-contract", response_model=str)
async def generate_contract_ai(
    req: ContractGenerateAIRequest,
    current_user: Profile = Depends(get_current_user)
):
    """Generates contract text content dynamically using template parameters or prompts."""
    return await AIService.generate_contract(req)

@router.post("/summarize", response_model=str)
async def summarize_contract_ai(
    req: ContractSummarizeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Generates a legal summary of a contract's key terms."""
    content = req.content
    if req.contract_id:
        contract = await ContractService.get_contract(db, req.contract_id)
        content = contract.generated_content
        
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Contract content must be provided."
        )
        
    return await AIService.summarize_contract(content)

@router.post("/improve", response_model=str)
async def improve_contract_ai(
    req: ContractImproveRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Rewrites contract content focusing on clarity, strictness, or liability adjustments."""
    content = req.content
    if req.contract_id:
        contract = await ContractService.get_contract(db, req.contract_id)
        content = contract.generated_content
        
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Contract content must be provided."
        )
        
    return await AIService.improve_contract(content, req.focus_area)

@router.post("/risk-analysis", response_model=ContractRiskAnalysisResponse)
async def risk_analysis_ai(
    req: ContractSummarizeRequest, # Reuse schema since it only requires content or contract_id
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Audits contract content for legal compliance risks and lists mitigations."""
    content = req.content
    if req.contract_id:
        contract = await ContractService.get_contract(db, req.contract_id)
        content = contract.generated_content
        
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Contract content must be provided."
        )
        
    return await AIService.analyze_risk(content)

@router.post("/generate-clause", response_model=str)
async def generate_clause_ai(
    req: ClauseGeneratorRequest,
    current_user: Profile = Depends(get_current_user)
):
    """Generates custom clauses based on target category context."""
    return await AIService.generate_clause(req)

@router.post("/rewrite-clause", response_model=str)
async def rewrite_clause_ai(
    req: RewriteClauseRequest,
    current_user: Profile = Depends(get_current_user)
):
    """Adjusts tone or bias (e.g. developer-friendly) of specific legal clauses."""
    return await AIService.rewrite_clause(req)

@router.post("/chat", response_model=AIChatResponse)
async def chat_about_contract(
    req: AIChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Interacts with an assistant chatbot referencing contract content."""
    contract = await ContractService.get_contract(db, req.contract_id)
    
    # Save user message
    user_msg = AIChatHistory(
        contract_id=req.contract_id,
        user_id=current_user.id,
        sender="user",
        message=req.message
    )
    db.add(user_msg)
    
    # Run interaction
    reply = await AIService.chat_interaction(contract.generated_content, req.message)
    
    # Save AI message
    ai_msg = AIChatHistory(
        contract_id=req.contract_id,
        user_id=current_user.id,
        sender="ai",
        message=reply
    )
    db.add(ai_msg)
    await db.commit()
    
    return AIChatResponse(
        reply=reply,
        timestamp=datetime.now(timezone.utc)
    )
