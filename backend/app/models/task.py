"""
SQLAlchemy models for Tasks, Steps, and Event logs.
"""
from datetime import datetime
import enum
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.database import Base


class TaskState(str, enum.Enum):
    NEW = "NEW"
    UNDERSTANDING = "UNDERSTANDING"
    IN_PROGRESS = "IN_PROGRESS"
    STUCK = "STUCK"
    RECOVERY = "RECOVERY"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)  # e.g., 'document_verification', 'sample_application'
    status = Column(Enum(TaskState), default=TaskState.NEW, nullable=False)
    current_step = Column(Integer, default=1, nullable=False)
    total_steps = Column(Integer, default=1, nullable=False)
    language = Column(String(10), default="en", nullable=False)
    owner_id = Column(String(64), nullable=True, index=True)
    context_data = Column(Text, default="{}", nullable=False)  # JSON-encoded string
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    steps = relationship("TaskStep", back_populates="task", cascade="all, delete-orphan", order_by="TaskStep.step_number")
    events = relationship("TaskEvent", back_populates="task", cascade="all, delete-orphan", order_by="TaskEvent.created_at")


class TaskStep(Base):
    __tablename__ = "task_steps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String(36), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    step_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    instruction = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    simplified_hint = Column(Text, nullable=True)
    recovery_guidance = Column(Text, nullable=True)
    completed = Column(Boolean, default=False, nullable=False)

    task = relationship("Task", back_populates="steps")


class TaskEvent(Base):
    __tablename__ = "task_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String(36), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(100), nullable=False)
    payload = Column(Text, default="{}", nullable=False)  # JSON-encoded string
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    task = relationship("Task", back_populates="events")
