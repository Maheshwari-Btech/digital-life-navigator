"""
Simulated Alexa+ Assistant Routes.
Provides conversational multi-turn dialogue, speech generation cues,
and direct coordination with the underlying task state machine.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.assistant import AlexaMessageRequest, AlexaMessageResponse
from app.services.alexa_service import AlexaService
from app.providers.factory import get_provider_status

router = APIRouter(prefix="/assistant", tags=["Alexa+ Simulation"])


@router.post("/message", response_model=AlexaMessageResponse)
def handle_alexa_utterance(req: AlexaMessageRequest, db: Session = Depends(get_db)):
    """Handles an incoming speech or text message from the user inside the Alexa+ simulation."""
    service = AlexaService(db)
    return service.process_utterance(req)


@router.get("/status")
def get_alexa_status():
    """Returns the capabilities and status of the Alexa+ simulation layer."""
    prov = get_provider_status()
    return {
        "alexa_plus_simulation": "active",
        "voice_synthesis_ready": True,
        "state_machine_connected": True,
        "engine": prov["provider"],
        "is_cloud_ai": prov["is_cloud"],
        "sample_prompts": [
            "Alexa, explain this document message",
            "Alexa, start my online application",
            "Alexa, I'm stuck on this step",
            "Alexa, can I do this later?",
            "Alexa, resume my application"
        ]
    }
