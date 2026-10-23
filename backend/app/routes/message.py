"""
Message Understanding Route (Flow A).
"""
from fastapi import APIRouter
from app.schemas.message import MessageExplainRequest, MessageExplanationResponse
from app.services.message_service import MessageService

router = APIRouter(prefix="/message", tags=["Message Understanding"])


@router.post("/explain", response_model=MessageExplanationResponse)
def explain_message(req: MessageExplainRequest):
    """Analyze and explain an unfamiliar digital message in simple, reassuring language."""
    service = MessageService()
    return service.explain(req.message, language=req.language)
