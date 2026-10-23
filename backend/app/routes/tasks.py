"""
Task Management Routes.
Implements Flow B (Guided Task Execution) and Flow C (Stuck & Recovery) along with Resume.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.task_engine import TaskEngine
from app.schemas.task import (
    TaskSchema,
    TaskCatalogItem,
    CreateTaskRequest,
    StuckRequest,
    RecoveryResponse,
    ExplainRequest,
    ExplainResponse
)

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/catalog", response_model=List[TaskCatalogItem])
def get_task_catalog(db: Session = Depends(get_db)):
    """Retrieve catalog of available safe synthetic tasks."""
    engine = TaskEngine(db)
    return engine.list_catalog()


@router.get("/active", response_model=List[TaskSchema])
def get_active_tasks(
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """Retrieve in-progress or paused tasks for one-click resumption, optionally scoped to active session."""
    engine = TaskEngine(db)
    return engine.get_active_or_paused_tasks(owner_id=session_id)


@router.post("", response_model=TaskSchema, status_code=status.HTTP_201_CREATED)
def create_task(
    req: CreateTaskRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """Start a new guided task workflow."""
    engine = TaskEngine(db)
    task = engine.create_task(
        task_type=req.type,
        language=req.language,
        custom_title=req.custom_title,
        context_data=req.context_data,
        owner_id=session_id
    )
    return task



@router.get("/{task_id}", response_model=TaskSchema)
def get_task(
    task_id: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """Get full task details with all steps and current state, verifying task ownership."""
    engine = TaskEngine(db)
    return engine.get_task(task_id, owner_id=session_id)


@router.post("/{task_id}/next", response_model=TaskSchema)
@router.post("/{task_id}/done", response_model=TaskSchema)
def advance_task_step(
    task_id: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """User pressed 'Done' or 'Next' to advance to the next step, verifying ownership."""
    engine = TaskEngine(db)
    return engine.advance_step(task_id, owner_id=session_id)


@router.post("/{task_id}/back", response_model=TaskSchema)
def step_back(
    task_id: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """Rewind to previous step safely without restarting, verifying ownership."""
    engine = TaskEngine(db)
    return engine.step_back(task_id, owner_id=session_id)


@router.post("/{task_id}/stuck", response_model=RecoveryResponse)
def handle_stuck(
    task_id: str,
    req: StuckRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """User pressed 'I'm Stuck' - get adaptive recovery guidance, verifying ownership."""
    engine = TaskEngine(db)
    return engine.mark_stuck(task_id, reason=req.reason, user_note=req.user_note, owner_id=session_id)


@router.post("/{task_id}/pause", response_model=TaskSchema)
def pause_task(
    task_id: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """Safely pause task to continue later, verifying ownership."""
    engine = TaskEngine(db)
    return engine.pause_task(task_id, owner_id=session_id)


@router.post("/{task_id}/resume", response_model=TaskSchema)
def resume_task(
    task_id: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """Resume a paused task right where the user left off, verifying ownership."""
    engine = TaskEngine(db)
    return engine.resume_task(task_id, owner_id=session_id)


@router.post("/{task_id}/explain", response_model=ExplainResponse)
def explain_step(
    task_id: str,
    req: ExplainRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """Explain why the current step matters in plain language, verifying ownership."""
    engine = TaskEngine(db)
    return engine.explain_step(task_id, question=req.question, owner_id=session_id)

