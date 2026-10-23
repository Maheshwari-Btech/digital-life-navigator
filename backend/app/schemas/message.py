"""
Pydantic schemas for the Message Understanding Engine (Flow A).
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class MessageExplainRequest(BaseModel):
    message: str = Field(..., min_length=3, max_length=2000, description="The digital notification or alert text to be explained.")
    language: str = Field(default="en", max_length=15, pattern=r"^(?i)(en|hi|mr)(-[a-z0-9]+)?$", description="Target language ('en', 'hi', 'mr')")


class MessageStepItem(BaseModel):
    step_number: int
    title: str
    instruction: str


class MessageExplanationResponse(BaseModel):
    summary: str
    meaning: str
    why_it_matters: str
    next_action: str
    warning: str
    steps: List[MessageStepItem]
    suggested_task_type: Optional[str] = None
    language: str = "en"
    ai_source: str = "Local AI Engine"
