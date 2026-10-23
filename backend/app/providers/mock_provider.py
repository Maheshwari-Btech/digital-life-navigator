"""
High-quality deterministic Mock AI Provider for Digital Life Navigator.
Runs 100% locally with ₹0 cost, zero API keys, and instant response time.
Provides compassionate, non-condescending, task-oriented guidance.
"""
from typing import Dict, Any, Optional, List
from app.providers.base import AIProvider


class MockProvider(AIProvider):
    def provider_name(self) -> str:
        return "Local Demo AI Engine (MockProvider)"

    def is_cloud(self) -> bool:
        return False

    def explain_message(self, message: str, language: str = "en") -> Dict[str, Any]:
        msg_lower = message.lower()

        # Check for language preferences
        is_hi = language.startswith("hi")
        is_mr = language.startswith("mr")

        # Scenario 1: Document Verification / KYC
        if any(w in msg_lower for w in ["document", "verify", "kyc", "identity", "id", "pan", "aadhaar"]):
            if is_hi:
                return {
                    "summary": "यह संदेश दस्तावेज़ सत्यापन के बारे में है।",
                    "meaning": "वेबसाइट चाहती है कि आप आगे बढ़ने से पहले अपना पहचान दस्तावेज़ जांचें।",
                    "why_it_matters": "यह सुनिश्चित करता है कि आपकी पहचान सुरक्षित है और कोई अन्य व्यक्ति आपकी जानकारी का उपयोग नहीं कर रहा है।",
                    "next_action": "सत्यापन पृष्ठ खोलें और अपने दस्तावेज़ के विवरण की जांच करें।",
                    "warning": "अपना गुप्त पासवर्ड या ओटीपी कभी भी किसी के साथ साझा न करें।",
                    "steps": [
                        {"step_number": 1, "title": "दस्तावेज़ अनुभाग खोलें", "instruction": "स्क्रीन पर 'Documents' या 'Upload' विकल्प पर क्लिक करें।"},
                        {"step_number": 2, "title": "नाम की जांच करें", "instruction": "सुनिश्चित करें कि दस्तावेज़ पर नाम आपके आवेदन से मेल खाता है।"},
                        {"step_number": 3, "title": "सत्यापन की पुष्टि करें", "instruction": "विवरण सही होने पर ही आगे बढ़ें।"}
                    ],
                    "suggested_task_type": "document_verification",
                    "language": "hi",
                    "ai_source": "Local Demo AI (Hindi)"
                }
            elif is_mr:
                return {
                    "summary": "हा संदेश कागदपत्र पडताळणीबद्दल आहे.",
                    "meaning": "वेबसाईटला हवे आहे की आपण पुढे जाण्यापूर्वी आपले कागदपत्र तपासावे.",
                    "why_it_matters": "यामुळे आपली ओळख सुरक्षित राहते आणि प्रक्रियेत कोणतीही त्रुटी राहत नाही.",
                    "next_action": "कागदपत्र विभाग उघडा आणि नावाचे स्पेलिंग तपासा.",
                    "warning": "आपला गुप्त पासवर्ड किंवा ओटीपी कोणाशीही शेअर करू नका.",
                    "steps": [
                        {"step_number": 1, "title": "कागदपत्र विभाग उघडा", "instruction": "स्क्रीनवरील 'Documents' पर्यायावर क्लिक करा."},
                        {"step_number": 2, "title": "नाव तपासा", "instruction": "कागदपत्रावरील नाव अर्जातील नावाशी जुळते याची खात्री करा."},
                        {"step_number": 3, "title": "पुष्टी करा", "instruction": "माहिती अचूक असल्यास पुढे जा."}
                    ],
                    "suggested_task_type": "document_verification",
                    "language": "mr",
                    "ai_source": "Local Demo AI (Marathi)"
                }
            else:
                return {
                    "summary": "This message is a document verification request.",
                    "meaning": "The website wants you to check and confirm your document before proceeding with your application.",
                    "why_it_matters": "Checking your document now prevents your application from being delayed or rejected later.",
                    "next_action": "Open the document section and verify that your details match before continuing.",
                    "warning": "Never share passwords, bank OTPs, or private identity cards with anyone claiming to help.",
                    "steps": [
                        {"step_number": 1, "title": "Open document section", "instruction": "Click on 'Documents' or 'Upload Verification' on the page."},
                        {"step_number": 2, "title": "Check name match", "instruction": "Ensure the spelling on your document exactly matches your application."},
                        {"step_number": 3, "title": "Confirm details", "instruction": "Click 'Continue' only after you verify the photo and details are clear."}
                    ],
                    "suggested_task_type": "document_verification",
                    "language": "en",
                    "ai_source": "Local Demo AI Engine"
                }

        # Scenario 2: Utility Bill / Payment
        if any(w in msg_lower for w in ["bill", "payment", "electricity", "water", "utility", "due", "pay"]):
            return {
                "summary": "This message is about a pending utility bill or payment.",
                "meaning": "A service provider is notifying you of an upcoming due date or pending statement balance.",
                "why_it_matters": "Reviewing your bill before paying ensures you only pay for what you actually used.",
                "next_action": "Check your consumer account number and verify the amount before making a payment.",
                "warning": "Never click payment links in suspicious SMS messages or share your UPI PIN to receive money.",
                "steps": [
                    {"step_number": 1, "title": "Open billing statement", "instruction": "Go to the official provider portal and view your latest bill."},
                    {"step_number": 2, "title": "Match Consumer ID", "instruction": "Check the 10-digit Consumer ID with your previous paper bills."},
                    {"step_number": 3, "title": "Confirm amount & pay", "instruction": "Confirm the due date and pay using your verified payment app."}
                ],
                "suggested_task_type": "utility_bill",
                "language": language,
                "ai_source": "Local Demo AI Engine"
            }

        # Scenario 3: General Online Application / Form
        return {
            "summary": "This message is requesting action on your online application.",
            "meaning": "The digital service is waiting for you to complete a specific step or review your information.",
            "why_it_matters": "Completing each step carefully ensures your application moves forward smoothly.",
            "next_action": "Open your application workspace and review the current step.",
            "warning": "Do not rush. Take your time to review each field. You can pause anytime.",
            "steps": [
                {"step_number": 1, "title": "Open application", "instruction": "Navigate to the application dashboard or open your active draft."},
                {"step_number": 2, "title": "Fill required details", "instruction": "Only enter the information marked with an asterisk (*)."},
                {"step_number": 3, "title": "Review and proceed", "instruction": "Review the summary before clicking next or submit."}
            ],
            "suggested_task_type": "sample_application",
            "language": language,
            "ai_source": "Local Demo AI Engine"
        }

    def determine_intent(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        text = user_input.lower().strip()

        # Starting a new task
        if any(w in text for w in ["start", "begin", "new task", "open task"]) or (
            any(w in text for w in ["application", "document", "bill", "verify", "form"])
            and any(w in text for w in ["start", "open", "do", "help me start", "fill", "help me do"])
        ):
            return {"intent": "start_task", "confidence": 0.95}

        # Stuck / Recovery
        if any(w in text for w in ["stuck", "confused", "don't know", "lost", "mistake", "wrong", "cannot find", "cant find"]):
            return {"intent": "get_stuck_recovery", "confidence": 0.95}
        if "help me" in text and not any(w in text for w in ["start", "begin", "create"]):
            return {"intent": "get_stuck_recovery", "confidence": 0.90}

        # Pause / Continue later
        if any(w in text for w in ["pause", "stop", "later", "continue later", "save for later", "come back later"]):
            return {"intent": "pause_task", "confidence": 0.94}

        # Advancing / Done
        if any(w in text for w in ["done", "completed", "finished", "next", "i did it", "finished step"]) or (
            "continue" in text and not any(w in text for w in ["later", "pause", "resume"])
        ):
            return {"intent": "advance_step", "confidence": 0.92}

        # Resume
        if any(w in text for w in ["resume", "welcome back", "pick up", "continue where"]):
            return {"intent": "resume_task", "confidence": 0.93}

        # Explain
        if any(w in text for w in ["explain", "what does this mean", "why", "simpler", "tell me more"]):
            return {"intent": "explain_step", "confidence": 0.91}

        return {"intent": "general_inquiry", "confidence": 0.70}

    def generate_step_explanation(
        self,
        task_title: str,
        step_title: str,
        instruction: str,
        language: str = "en",
        question: Optional[str] = None
    ) -> Dict[str, Any]:
        base_explanation = f"Here is what this step means: {instruction} You are in complete control, and nothing permanent is submitted yet."
        if question and question.strip():
            plain_english = f"Regarding your question ('{question.strip()}'): {instruction} You are in complete control, and nothing permanent is submitted yet."
        else:
            plain_english = base_explanation

        return {
            "plain_english": plain_english,
            "why_it_matters": f"Taking this step carefully ensures {step_title.lower()} is done right the first time.",
            "what_not_to_do": "Do not enter passwords, OTPs, or hurry. Take your time.",
            "encouragement": "You're doing great. Millions of people do this every day, and you can do it too!"
        }

    def generate_recovery(
        self,
        task_title: str,
        step_title: str,
        reason: str,
        user_note: Optional[str] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        reason_lower = reason.lower()

        if "mistake" in reason_lower or "wrong" in reason_lower:
            return {
                "reassurance": "That is completely okay! Making a small mistake is normal, and nothing is broken.",
                "simpler_instruction": "You do not need to start over. We can simply correct this step together.",
                "action_items": [
                    "Click the 'Back' button or look for the 'Edit' / 'Replace' link.",
                    "Select the correct file or re-type the right information.",
                    "Verify the correction, then click 'Done' to continue."
                ],
                "can_rewind_step": True
            }

        if "click" in reason_lower or "where" in reason_lower:
            return {
                "reassurance": "Don't worry, many websites hide buttons in tricky spots.",
                "simpler_instruction": "Look towards the bottom-right corner or the center of the card for the primary button.",
                "action_items": [
                    "Look for a highlighted button (usually blue or green).",
                    "If on a phone, scroll down slightly to ensure the button isn't hidden below your keyboard.",
                    "Once you click it, return here and press 'Done'."
                ],
                "can_rewind_step": False
            }

        if "understand" in reason_lower or "not sure" in reason_lower:
            return {
                "reassurance": "Digital terms can be confusing. Let's make it super simple.",
                "simpler_instruction": f"All you need to do right now is: {step_title}.",
                "action_items": [
                    "Focus only on this single step. Ignore any other complicated menus.",
                    "Follow the one action mentioned in the blue box.",
                    "If you still feel hesitant, you can pause anytime and return later."
                ],
                "can_rewind_step": False
            }

        # Default recovery
        return {
            "reassurance": "Take a deep breath. You are doing well, and we'll take it one small step at a time.",
            "simpler_instruction": "Let's review the current step with extra simplicity.",
            "action_items": [
                "Read the short instruction on your screen.",
                "Try the action once.",
                "If it doesn't work, click Back or Continue Later."
            ],
            "can_rewind_step": False
        }

    def simplify(self, text: str, language: str = "en") -> str:
        # Replaces bureaucratic words with warm, human equivalents
        replacements = {
            "authenticate": "confirm who you are",
            "credentials": "login details",
            "mandatory": "required",
            "terminate": "close",
            "execute": "run",
            "initialize": "start",
            "persist": "save"
        }
        res = text
        for k, v in replacements.items():
            res = res.replace(k, v)
        return res

    def alexa_dialog(
        self,
        user_utterance: str,
        state: Dict[str, Any],
        language: str = "en"
    ) -> Dict[str, Any]:
        intent_info = self.determine_intent(user_utterance, state)
        intent = intent_info["intent"]
        task_id = state.get("current_task_id")
        current_step = state.get("current_step", 1)
        total_steps = state.get("total_steps", 5)

        if intent == "get_stuck_recovery":
            recovery = self.generate_recovery("Digital Task", f"Step {current_step}", "I'm stuck", language=language)
            return {
                "alexa_reply": f"That's completely okay. {recovery['reassurance']} {recovery['simpler_instruction']}",
                "speech_text": f"That's completely okay. {recovery['reassurance']} {recovery['simpler_instruction']}",
                "visual_card": {
                    "title": "Help is right here",
                    "content": "\n".join([f"• {item}" for item in recovery["action_items"]]),
                    "step_number": current_step,
                    "total_steps": total_steps,
                    "status": "RECOVERY",
                    "action_prompt": "Try that step now, or say 'Go back'."
                },
                "quick_suggestions": ["I did it, continue", "Go back a step", "Explain again", "Pause for later"],
                "audio_cue": "recovery"
            }

        if intent == "advance_step":
            next_step = current_step + 1
            if next_step > total_steps:
                return {
                    "alexa_reply": "Congratulations! You have completed all the steps. Your task is finished successfully.",
                    "speech_text": "Congratulations! You have completed all the steps. Your task is finished successfully.",
                    "visual_card": {
                        "title": "Task Completed 🎉",
                        "content": "You did it yourself step-by-step. You can start another task or return home anytime.",
                        "status": "COMPLETED",
                        "action_prompt": "Say 'Home' or 'Start a new task'."
                    },
                    "quick_suggestions": ["Start another task", "Return Home"],
                    "audio_cue": "affirmative"
                }
            return {
                "alexa_reply": f"Great progress! Let's move to Step {next_step} of {total_steps}.",
                "speech_text": f"Great progress! Moving to step {next_step} of {total_steps}.",
                "visual_card": {
                    "title": f"Step {next_step} of {total_steps}",
                    "content": "Focus only on this step. When done, just say 'Done' or press continue.",
                    "step_number": next_step,
                    "total_steps": total_steps,
                    "status": "IN_PROGRESS",
                    "action_prompt": "Take your time. Say 'I'm stuck' if you need help."
                },
                "quick_suggestions": ["Done", "I'm stuck", "Explain this step", "Pause for later"],
                "audio_cue": "affirmative"
            }

        if intent == "pause_task":
            return {
                "alexa_reply": f"No problem at all! I have safely saved your progress at Step {current_step} of {total_steps}. Whenever you return, just ask me to resume.",
                "speech_text": f"No problem! I have safely saved your progress. Whenever you return, just ask me to resume.",
                "visual_card": {
                    "title": "Task Safely Saved",
                    "content": f"Saved at Step {current_step} of {total_steps}. You will NOT have to repeat previous steps.",
                    "step_number": current_step,
                    "total_steps": total_steps,
                    "status": "PAUSED",
                    "action_prompt": "You can close this tab safely."
                },
                "quick_suggestions": ["Resume my task", "Start a new task", "Go home"],
                "audio_cue": "chime"
            }

        if intent == "resume_task":
            return {
                "alexa_reply": f"Welcome back! You were working on your task. You completed {max(0, current_step - 1)} steps. Ready to continue from Step {current_step}?",
                "speech_text": f"Welcome back! Ready to continue from Step {current_step}?",
                "visual_card": {
                    "title": "Resume Your Task",
                    "content": f"Pick up right from Step {current_step} of {total_steps}. Everything is ready for you.",
                    "step_number": current_step,
                    "total_steps": total_steps,
                    "status": "IN_PROGRESS",
                    "action_prompt": "Say 'Continue' or 'Start Over'."
                },
                "quick_suggestions": ["Continue from here", "Start over", "Explain this step"],
                "audio_cue": "chime"
            }

        # Default conversational assistance
        return {
            "alexa_reply": "I'm right here with you. Tell me what message you received, or say 'Start an application' and we'll do it one step at a time.",
            "speech_text": "I'm right here with you. Tell me what you'd like to do, and we'll do it one step at a time.",
            "visual_card": {
                "title": "Digital Life Navigator",
                "content": "• Paste an unfamiliar message to understand it\n• Start a guided step-by-step task\n• Say 'I'm stuck' anytime for friendly recovery",
                "status": "UNDERSTANDING",
                "action_prompt": "What would you like help with today?"
            },
            "quick_suggestions": [
                "Explain a verification message",
                "Help me complete an application",
                "Help me verify a utility bill"
            ],
            "audio_cue": "chime"
        }
