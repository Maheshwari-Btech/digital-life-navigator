"""
Pydantic schemas for the Simulated Alexa+ Conversational Experience.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class AlexaMessageRequest(BaseModel):
    user_message: str = Field(..., min_length=1, max_length=1000, description="Spoken or typed utterance from user")
    session_id: Optional[str] = Field(default="alexa-session-default", max_length=100, description="Conversation session id")
    current_task_id: Optional[str] = Field(default=None, max_length=64, description="Active task ID if already engaged in task")
    language: str = Field(default="en", max_length=15, pattern=r"^(?i)(en|hi|mr)(-[a-z0-9]+)?$", description="Language code: en, hi, mr")


class AlexaVisualCard(BaseModel):
    title: str
    content: str
    step_number: Optional[int] = None
    total_steps: Optional[int] = None
    status: Optional[str] = None
    action_prompt: Optional[str] = None


class AlexaMessageResponse(BaseModel):
    alexa_reply: str
    speech_text: str  # For text-to-speech reading
    visual_card: Optional[AlexaVisualCard] = None
    current_task_id: Optional[str] = None
    current_step: Optional[int] = None
    task_status: Optional[str] = None
    quick_suggestions: List[str] = []
    audio_cue: Optional[str] = "chime"  # 'chime', 'affirmative', 'recovery'
    ai_source: str = "Simulated Alexa+ Engine"
