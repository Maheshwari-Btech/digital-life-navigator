"""
Pydantic schemas for Tasks, Steps, Recovery, and Progression.
"""
import json
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.models.task import TaskState


class TaskStepSchema(BaseModel):
    id: Optional[int] = None
    step_number: int
    title: str
    instruction: str
    explanation: str
    simplified_hint: Optional[str] = None
    recovery_guidance: Optional[str] = None
    completed: bool = False

    model_config = ConfigDict(from_attributes=True)


class TaskSchema(BaseModel):
    id: str
    title: str
    type: str
    status: TaskState
    current_step: int
    total_steps: int
    language: str = "en"
    owner_id: Optional[str] = None
    context_data: Optional[Dict[str, Any]] = None
    steps: List[TaskStepSchema] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("context_data", mode="before")
    @classmethod
    def parse_context_data(cls, v: Any) -> Optional[Dict[str, Any]]:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return {}
        if isinstance(v, dict):
            return v
        return {}


class TaskCatalogItem(BaseModel):
    type: str
    title: str
    description: str
    estimated_minutes: int
    total_steps: int
    badge: str


class CreateTaskRequest(BaseModel):
    type: str = Field(..., max_length=100, description="Task type identifier e.g. 'document_verification'")
    language: str = Field(default="en", max_length=15, pattern=r"^(?i)(en|hi|mr)(-[a-z0-9]+)?$", description="User preferred language code: 'en', 'hi', 'mr'")
    custom_title: Optional[str] = Field(default=None, max_length=255)
    context_data: Optional[Dict[str, Any]] = None


class StepActionRequest(BaseModel):
    notes: Optional[str] = Field(default=None, max_length=1000)


class StuckRequest(BaseModel):
    reason: str = Field(
        ...,
        min_length=2,
        max_length=500,
        description="Reason selected by user, e.g. 'I don't understand this', 'I don't know where to click', 'I think I made a mistake', 'Show me again'"
    )
    user_note: Optional[str] = Field(default=None, max_length=1000)


class RecoveryResponse(BaseModel):
    task_id: str
    current_step: int
    reason: str
    reassurance: str
    simpler_instruction: str
    action_items: List[str]
    can_rewind_step: bool = False


class ExplainRequest(BaseModel):
    question: Optional[str] = Field(default=None, max_length=500)
    simplified: bool = False


class ExplainResponse(BaseModel):
    task_id: str
    step_number: int
    title: str
    plain_english: str
    why_it_matters: str
    what_not_to_do: str
    encouragement: str
