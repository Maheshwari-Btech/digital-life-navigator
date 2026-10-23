"""
Health and Diagnostic API Route.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.providers.factory import get_provider_status

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    provider_info = get_provider_status()

    return {
        "status": "healthy" if db_ok else "degraded",
        "app": "Digital Life Navigator",
        "version": "1.0.0",
        "database": "connected" if db_ok else "error",
        "ai_provider": provider_info["provider"],
        "is_cloud_ai": provider_info["is_cloud"],
        "ui_label": provider_info["label"],
        "ui_badge": provider_info["badge"],
    }
