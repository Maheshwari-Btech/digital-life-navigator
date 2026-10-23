"""
Simulated Alexa+ Conversational Service.
Interprets spoken or typed voice commands, links to the underlying Task Engine,
and drives conversational guidance with voice audio cues and visual cards.
"""
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.schemas.assistant import AlexaMessageRequest, AlexaMessageResponse, AlexaVisualCard
from app.services.task_engine import TaskEngine
from app.providers.factory import get_ai_provider, get_provider_status


class AlexaService:
    def __init__(self, db: Session):
        self.db = db
        self.task_engine = TaskEngine(db)
        self.ai = get_ai_provider()

    def process_utterance(self, req: AlexaMessageRequest) -> AlexaMessageResponse:
        user_text = req.user_message.strip()
        task_id = req.current_task_id
        active_task = None
        current_step = 1
        total_steps = 5

        if task_id:
            try:
                active_task = self.task_engine.get_task(task_id)
                current_step = active_task.current_step
                total_steps = active_task.total_steps
            except Exception:
                task_id = None

        state_context = {
            "current_task_id": task_id,
            "current_step": current_step,
            "total_steps": total_steps,
            "language": req.language
        }

        intent_info = self.ai.determine_intent(user_text, state_context)
        intent = intent_info.get("intent")

        # Intent 1: Start Task
        if intent == "start_task" and not active_task:
            task_type = "sample_application"
            if "document" in user_text.lower() or "verify" in user_text.lower():
                task_type = "document_verification"
            elif "bill" in user_text.lower() or "utility" in user_text.lower():
                task_type = "utility_bill"

            new_task = self.task_engine.create_task(task_type, language=req.language)
            step_1 = new_task.steps[0] if new_task.steps else None
            return AlexaMessageResponse(
                alexa_reply=f"I've started the {new_task.title} for you. Step 1 of {new_task.total_steps}: {step_1.instruction if step_1 else 'Get started'}",
                speech_text=f"I've started the {new_task.title}. Step 1: {step_1.instruction if step_1 else ''}",
                visual_card=AlexaVisualCard(
                    title=f"Step 1: {step_1.title if step_1 else 'Start'}",
                    content=step_1.instruction if step_1 else "",
                    step_number=1,
                    total_steps=new_task.total_steps,
                    status="IN_PROGRESS",
                    action_prompt="Say 'Done' when you've finished this step."
                ),
                current_task_id=new_task.id,
                current_step=1,
                task_status="IN_PROGRESS",
                quick_suggestions=["Done", "I'm stuck", "Explain again", "Pause"],
                audio_cue="affirmative",
                ai_source=get_provider_status()["provider"]
            )

        # Intent 2: Advance Step
        if intent == "advance_step" and active_task:
            updated_task = self.task_engine.advance_step(task_id)
            if updated_task.status.value == "COMPLETED":
                return AlexaMessageResponse(
                    alexa_reply="Congratulations! You have completed all steps in this task successfully. Great job!",
                    speech_text="Congratulations! You have completed all steps successfully. Great job!",
                    visual_card=AlexaVisualCard(
                        title="Task Completed 🎉",
                        content="You did it yourself step-by-step. Everything has been safely saved.",
                        status="COMPLETED",
                        action_prompt="Say 'Start another task' or 'Go home'."
                    ),
                    current_task_id=updated_task.id,
                    current_step=updated_task.current_step,
                    task_status="COMPLETED",
                    quick_suggestions=["Start another task", "Return Home"],
                    audio_cue="affirmative",
                    ai_source=get_provider_status()["provider"]
                )
            curr_step_obj = [s for s in updated_task.steps if s.step_number == updated_task.current_step]
            step_info = curr_step_obj[0] if curr_step_obj else None
            return AlexaMessageResponse(
                alexa_reply=f"Nicely done. Moving to Step {updated_task.current_step} of {updated_task.total_steps}: {step_info.instruction if step_info else ''}",
                speech_text=f"Nicely done. Step {updated_task.current_step}: {step_info.instruction if step_info else ''}",
                visual_card=AlexaVisualCard(
                    title=f"Step {updated_task.current_step}: {step_info.title if step_info else ''}",
                    content=step_info.instruction if step_info else "",
                    step_number=updated_task.current_step,
                    total_steps=updated_task.total_steps,
                    status="IN_PROGRESS",
                    action_prompt="Say 'Done' when ready, or 'I'm stuck' if you need assistance."
                ),
                current_task_id=updated_task.id,
                current_step=updated_task.current_step,
                task_status="IN_PROGRESS",
                quick_suggestions=["Done", "I'm stuck", "Explain this step", "Pause"],
                audio_cue="affirmative",
                ai_source=get_provider_status()["provider"]
            )

        # Intent 3: Stuck Recovery
        if intent == "get_stuck_recovery" and active_task:
            recovery = self.task_engine.mark_stuck(task_id, reason=user_text)
            action_text = "\n".join([f"• {item}" for item in recovery["action_items"]])
            return AlexaMessageResponse(
                alexa_reply=f"That's completely okay. {recovery['reassurance']} {recovery['simpler_instruction']}",
                speech_text=f"That's completely okay. {recovery['reassurance']} {recovery['simpler_instruction']}",
                visual_card=AlexaVisualCard(
                    title="Recovery Guidance",
                    content=action_text,
                    step_number=active_task.current_step,
                    total_steps=active_task.total_steps,
                    status="RECOVERY",
                    action_prompt="Try these steps, or say 'Go back'."
                ),
                current_task_id=active_task.id,
                current_step=active_task.current_step,
                task_status="RECOVERY",
                quick_suggestions=["I did it, continue", "Go back a step", "Explain again", "Pause"],
                audio_cue="recovery",
                ai_source=get_provider_status()["provider"]
            )

        # Intent 4: Pause
        if intent == "pause_task" and active_task:
            paused_task = self.task_engine.pause_task(task_id)
            return AlexaMessageResponse(
                alexa_reply=f"No problem! I have safely saved your progress at Step {paused_task.current_step} of {paused_task.total_steps}. Whenever you return, just say 'Resume'.",
                speech_text=f"No problem! I have safely saved your progress. Whenever you return, just say 'Resume'.",
                visual_card=AlexaVisualCard(
                    title="Task Safely Saved",
                    content=f"You completed {max(0, paused_task.current_step - 1)} steps. You will not have to start over.",
                    step_number=paused_task.current_step,
                    total_steps=paused_task.total_steps,
                    status="PAUSED",
                    action_prompt="You can close the app safely."
                ),
                current_task_id=paused_task.id,
                current_step=paused_task.current_step,
                task_status="PAUSED",
                quick_suggestions=["Resume task", "Start a new task"],
                audio_cue="chime",
                ai_source=get_provider_status()["provider"]
            )

        # Intent 5: Resume
        if intent == "resume_task":
            # If no active task passed, check if there's any paused task in DB
            target_task = active_task
            if not target_task:
                paused_list = self.task_engine.get_active_or_paused_tasks()
                if paused_list:
                    target_task = paused_list[0]

            if target_task:
                resumed = self.task_engine.resume_task(target_task.id)
                curr_s = [s for s in resumed.steps if s.step_number == resumed.current_step]
                s_obj = curr_s[0] if curr_s else None
                return AlexaMessageResponse(
                    alexa_reply=f"Welcome back! You were working on {resumed.title}. Continuing from Step {resumed.current_step} of {resumed.total_steps}.",
                    speech_text=f"Welcome back! Continuing from Step {resumed.current_step}.",
                    visual_card=AlexaVisualCard(
                        title=f"Step {resumed.current_step}: {s_obj.title if s_obj else ''}",
                        content=s_obj.instruction if s_obj else "",
                        step_number=resumed.current_step,
                        total_steps=resumed.total_steps,
                        status="IN_PROGRESS",
                        action_prompt="Say 'Done' when finished."
                    ),
                    current_task_id=resumed.id,
                    current_step=resumed.current_step,
                    task_status="IN_PROGRESS",
                    quick_suggestions=["Done", "I'm stuck", "Explain this step", "Pause"],
                    audio_cue="affirmative",
                    ai_source=get_provider_status()["provider"]
                )

        # Fallback dialog
        dialog_res = self.ai.alexa_dialog(user_text, state_context, req.language)
        return AlexaMessageResponse(
            alexa_reply=dialog_res["alexa_reply"],
            speech_text=dialog_res["speech_text"],
            visual_card=AlexaVisualCard(**dialog_res["visual_card"]) if dialog_res.get("visual_card") else None,
            current_task_id=task_id,
            current_step=current_step,
            task_status="IN_PROGRESS" if task_id else "UNDERSTANDING",
            quick_suggestions=dialog_res.get("quick_suggestions", ["Explain a message", "Start application"]),
            audio_cue=dialog_res.get("audio_cue", "chime"),
            ai_source=get_provider_status()["provider"]
        )
