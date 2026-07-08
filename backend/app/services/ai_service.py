import os
from openai import AsyncOpenAI
from app.core.config import settings
from app.core.logger import logger
from app.schemas.contract import (
    ContractGenerateAIRequest,
    ContractSummarizeRequest,
    ContractImproveRequest,
    ContractRiskAnalysisResponse,
    ClauseGeneratorRequest,
    RewriteClauseRequest,
    RiskClause,
)
import json
from typing import Optional, Dict, Any

# Initialize client
client = None
if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "mock-openai-key":
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

class AIService:
    @staticmethod
    async def generate_contract(req: ContractGenerateAIRequest) -> str:
        """Generate a contract dynamically via AI."""
        if not client:
            # Mock generator fallback
            logger.info("Using mock contract generation (No OpenAI API key found)")
            template = (
                f"=== {req.purpose.upper()} AGREEMENT ===\n\n"
                f"This agreement is made between the parties as designated under local terms.\n\n"
            )
            for k, v in req.variables.items():
                template += f"{k.replace('_', ' ').title()}: {v}\n"
            template += (
                f"\n1. PURPOSE\nThe purpose of this contract is to establish {req.purpose}.\n\n"
                f"2. EXTRA CLAUSES & CONDITIONS\n{req.extra_instructions or 'No additional instructions specified.'}\n\n"
                f"3. SIGNATURES\nBoth parties agree to the terms herein."
            )
            return template

        prompt = (
            f"Generate a professional, legally binding contract with purpose '{req.purpose}'. "
            f"Use the following custom variables to fill details:\n{json.dumps(req.variables)}\n"
            f"Additional Instructions: {req.extra_instructions or 'None'}"
        )
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an expert corporate legal counsel. Write formal, structured, high-quality agreements."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"OpenAI error during contract generation: {str(e)}")
            raise e

    @staticmethod
    async def summarize_contract(content: str) -> str:
        """Generate a clean legal summary of the contract content."""
        if not client:
            return (
                "SUMMARY:\n"
                "• Type: General Agreement.\n"
                "• Low risk: No major high-risk clauses found.\n"
                "• Key clauses: Standard intellectual property protection and mutual confidentiality are included."
            )

        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a legal assistant. Summarize the key terms, obligations, and timelines of this contract in simple terms."},
                    {"role": "user", "content": content}
                ]
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"OpenAI error during contract summary: {str(e)}")
            raise e

    @staticmethod
    async def improve_contract(content: str, focus_area: str) -> str:
        """Improve/rewrite the contract focusing on a specific goal."""
        if not client:
            return content + f"\n\n[AMENDMENT (Focus: {focus_area})]\nThe parties agree to maintain strict adherence to industry regulations."

        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": f"You are a contract lawyer. Edit this contract to optimize for '{focus_area}' while retaining legal validity."},
                    {"role": "user", "content": content}
                ]
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"OpenAI error during contract improvement: {str(e)}")
            raise e

    @staticmethod
    async def analyze_risk(content: str) -> ContractRiskAnalysisResponse:
        """Identify high/medium risk clauses and generate risk mitigation suggestions."""
        if not client:
            # Mock risk analysis response
            return ContractRiskAnalysisResponse(
                overall_score=15.0,
                risk_clauses=[
                    RiskClause(
                        clause="Non-compete duration of 2 years",
                        severity="Medium",
                        description="A 2-year non-compete clause might be deemed overly restrictive in certain jurisdictions.",
                        mitigation="Reduce non-compete duration to 6 or 12 months."
                    )
                ],
                summary="Overall, this contract is clean and well-structured, presenting a low risk score of 15%."
            )

        prompt = (
            "Analyze the following contract for potential legal risks, liabilities, and unfavorable clauses. "
            "Return the analysis STRICTLY in JSON format matching this schema:\n"
            "{\n"
            "  'overall_score': 0.0 to 100.0,\n"
            "  'risk_clauses': [\n"
            "    {'clause': '...', 'severity': 'High/Medium/Low', 'description': '...', 'mitigation': '...'}\n"
            "  ],\n"
            "  'summary': '...'\n"
            "}\n\n"
            f"Contract Content:\n{content}"
        )
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a senior risk compliance auditor. Return ONLY a valid JSON object block matching the requested structure."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            data = json.loads(response.choices[0].message.content or "{}")
            return ContractRiskAnalysisResponse(**data)
        except Exception as e:
            logger.error(f"OpenAI error during risk analysis: {str(e)}")
            raise e

    @staticmethod
    async def generate_clause(req: ClauseGeneratorRequest) -> str:
        """Generate a single legal clause based on description/context."""
        if not client:
            return f"/* Generated {req.clause_type} Clause */\nEach party shall indemnify, defend, and hold harmless the other party from any liabilities."

        prompt = f"Write a professional legal '{req.clause_type}' clause. Context / Requirements: {req.context or 'None'}"
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": f"You are a contract drafting specialist. Write a clean '{req.clause_type}' clause."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"OpenAI error during clause generation: {str(e)}")
            raise e

    @staticmethod
    async def rewrite_clause(req: RewriteClauseRequest) -> str:
        """Rewrite a clause to adjust its tone or bias."""
        if not client:
            return req.clause_text + f"\n[Adjusted Tone: {req.tone}]"

        prompt = f"Rewrite this legal clause to be: '{req.tone}'.\nOriginal clause:\n{req.clause_text}"
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a legal drafting advisor. Modify the bias, strictness, or tone of clauses as requested."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"OpenAI error during clause rewrite: {str(e)}")
            raise e

    @staticmethod
    async def chat_interaction(content: str, message: str) -> str:
        """Chat with the AI about a specific contract."""
        if not client:
            return "I am running in local mock mode. I can see the contract content, but cannot process full conversations without a valid OpenAI API key."

        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": f"You are an AI assistant helping a user understand this contract:\n{content}"},
                    {"role": "user", "content": message}
                ]
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"OpenAI error during chat interaction: {str(e)}")
            raise e
