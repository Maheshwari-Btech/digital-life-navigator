"""
Authoritative backend Task Engine.
Implements the core finite state machine:
NEW -> UNDERSTANDING -> IN_PROGRESS -> STUCK -> RECOVERY -> PAUSED -> COMPLETED
Maintains task steps, safe persistence, and recovery paths.
"""
import uuid
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.task import Task, TaskStep, TaskEvent, TaskState
from app.data.synthetic_tasks import get_task_template, SYNTHETIC_TASK_CATALOG
from app.providers.factory import get_ai_provider


class TaskEngine:
    def __init__(self, db: Session):
        self.db = db
        self.ai = get_ai_provider()

    def _log_event(self, task_id: str, event_type: str, payload: dict):
        event = TaskEvent(
            task_id=task_id,
            event_type=event_type,
            payload=json.dumps(payload),
            created_at=datetime.utcnow()
        )
        self.db.add(event)
        self.db.commit()

    def list_catalog(self) -> List[dict]:
        return [
            {
                "type": t["type"],
                "title": t["title"],
                "description": t["description"],
                "estimated_minutes": t["estimated_minutes"],
                "total_steps": t["total_steps"],
                "badge": t["badge"]
            }
            for t in SYNTHETIC_TASK_CATALOG
        ]

    def create_task(
        self,
        task_type: str,
        language: str = "en",
        custom_title: Optional[str] = None,
        context_data: Optional[Dict[str, Any]] = None,
        owner_id: Optional[str] = None
    ) -> Task:
        template = get_task_template(task_type)
        task_id = str(uuid.uuid4())
        title = custom_title or template["title"]

        task = Task(
            id=task_id,
            title=title,
            type=task_type,
            status=TaskState.IN_PROGRESS,
            current_step=1,
            total_steps=template["total_steps"],
            language=language,
            owner_id=owner_id,
            context_data=json.dumps(context_data or {}),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(task)

        for step_data in template["steps"]:
            step = TaskStep(
                task_id=task_id,
                step_number=step_data["step_number"],
                title=step_data["title"],
                instruction=step_data["instruction"],
                explanation=step_data["explanation"],
                simplified_hint=step_data.get("simplified_hint"),
                recovery_guidance=step_data.get("recovery_guidance"),
                completed=False
            )
            self.db.add(step)

        self.db.commit()
        self.db.refresh(task)

        self._log_event(task_id, "TASK_CREATED", {"type": task_type, "language": language})
        return task

    def get_task(self, task_id: str, owner_id: Optional[str] = None) -> Task:
        task = self.db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found.")
        if task.owner_id and owner_id and task.owner_id != owner_id:
            raise HTTPException(status_code=403, detail="Access denied: You do not own this task.")
        if not task.owner_id and owner_id:
            task.owner_id = owner_id
            self.db.commit()
        return task

    def get_active_or_paused_tasks(self, owner_id: Optional[str] = None) -> List[Task]:
        """Returns tasks that are currently paused or in progress for easy resume, optionally filtered by owner."""
        query = self.db.query(Task).filter(
            Task.status.in_([TaskState.IN_PROGRESS, TaskState.PAUSED, TaskState.STUCK, TaskState.RECOVERY])
        )
        if owner_id is not None:
            query = query.filter(Task.owner_id == owner_id)
        return (
            query.order_by(Task.updated_at.desc())
            .limit(5)
            .all()
        )

    def advance_step(self, task_id: str, owner_id: Optional[str] = None) -> Task:
        task = self.get_task(task_id, owner_id=owner_id)

        # Safeguard: if task is already completed, do not advance or mutate
        if task.status == TaskState.COMPLETED:
            return task

        # Mark current step as completed
        current_step_obj = (
            self.db.query(TaskStep)
            .filter(TaskStep.task_id == task_id, TaskStep.step_number == task.current_step)
            .first()
        )
        if current_step_obj:
            current_step_obj.completed = True

        if task.current_step >= task.total_steps:
            task.status = TaskState.COMPLETED
            task.current_step = task.total_steps
            self._log_event(task_id, "TASK_COMPLETED", {"completed_step": task.current_step})
        else:
            task.current_step += 1
            task.status = TaskState.IN_PROGRESS
            self._log_event(task_id, "STEP_ADVANCED", {"new_step": task.current_step})

        task.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(task)
        return task

    def step_back(self, task_id: str, owner_id: Optional[str] = None) -> Task:
        task = self.get_task(task_id, owner_id=owner_id)
        if task.status == TaskState.COMPLETED:
            raise HTTPException(status_code=400, detail="Cannot step back on an already completed task.")

        if task.current_step > 1:
            task.current_step -= 1
            task.status = TaskState.IN_PROGRESS
            # Uncomplete the step we backed out of
            curr = self.db.query(TaskStep).filter(TaskStep.task_id == task_id, TaskStep.step_number == task.current_step).first()
            if curr:
                curr.completed = False
            task.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(task)
            self._log_event(task_id, "STEP_BACK", {"current_step": task.current_step})
        return task

    def mark_stuck(self, task_id: str, reason: str, user_note: Optional[str] = None, owner_id: Optional[str] = None) -> dict:
        task = self.get_task(task_id, owner_id=owner_id)
        task.status = TaskState.STUCK
        task.updated_at = datetime.utcnow()
        self.db.commit()

        curr_step = (
            self.db.query(TaskStep)
            .filter(TaskStep.task_id == task_id, TaskStep.step_number == task.current_step)
            .first()
        )
        step_title = curr_step.title if curr_step else f"Step {task.current_step}"

        recovery_data = self.ai.generate_recovery(
            task_title=task.title,
            step_title=step_title,
            reason=reason,
            user_note=user_note,
            language=task.language
        )

        # Transition to RECOVERY state
        task.status = TaskState.RECOVERY
        self.db.commit()
        self._log_event(task_id, "STUCK_RECOVERY", {"reason": reason, "recovery": recovery_data})

        return {
            "task_id": task.id,
            "current_step": task.current_step,
            "reason": reason,
            "reassurance": recovery_data.get("reassurance", "You are doing great! Let's solve this together."),
            "simpler_instruction": recovery_data.get("simpler_instruction", "Review the step and take your time."),
            "action_items": recovery_data.get("action_items", ["Check the screen carefully", "Try once more"]),
            "can_rewind_step": recovery_data.get("can_rewind_step", False)
        }

    def pause_task(self, task_id: str, owner_id: Optional[str] = None) -> Task:
        task = self.get_task(task_id, owner_id=owner_id)
        if task.status == TaskState.COMPLETED:
            raise HTTPException(status_code=400, detail="Cannot pause an already completed task.")
        task.status = TaskState.PAUSED
        task.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(task)
        self._log_event(task_id, "TASK_PAUSED", {"saved_at_step": task.current_step})
        return task

    def resume_task(self, task_id: str, owner_id: Optional[str] = None) -> Task:
        task = self.get_task(task_id, owner_id=owner_id)
        if task.status == TaskState.COMPLETED:
            raise HTTPException(status_code=400, detail="This task is already completed and cannot be resumed.")
        task.status = TaskState.IN_PROGRESS
        task.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(task)
        self._log_event(task_id, "TASK_RESUMED", {"resumed_at_step": task.current_step})
        return task

    def explain_step(self, task_id: str, question: Optional[str] = None, owner_id: Optional[str] = None) -> dict:
        task = self.get_task(task_id, owner_id=owner_id)
        curr_step = (
            self.db.query(TaskStep)
            .filter(TaskStep.task_id == task_id, TaskStep.step_number == task.current_step)
            .first()
        )
        if not curr_step:
            raise HTTPException(status_code=400, detail="Current step not found.")

        explanation = self.ai.generate_step_explanation(
            task_title=task.title,
            step_title=curr_step.title,
            instruction=curr_step.instruction,
            language=task.language,
            question=question
        )
        self._log_event(task_id, "STEP_EXPLAINED", {"step": task.current_step, "question": question})

        return {
            "task_id": task.id,
            "step_number": task.current_step,
            "title": curr_step.title,
            "plain_english": explanation.get("plain_english", curr_step.instruction),
            "why_it_matters": explanation.get("why_it_matters", curr_step.explanation),
            "what_not_to_do": explanation.get("what_not_to_do", "Never share sensitive bank details or passwords."),
            "encouragement": explanation.get("encouragement", "You can do this safely step by step.")
        }

