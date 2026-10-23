"""
Amazon Bedrock AI Provider for Digital Life Navigator.
Allows real AWS Bedrock foundation model integration (Claude 3 / Nova / Titan)
with zero-crash fallback to MockProvider when AWS credentials are not configured.
"""
import json
import logging
from typing import Dict, Any, Optional
from app.providers.base import AIProvider
from app.providers.mock_provider import MockProvider
from app.config import settings

logger = logging.getLogger(__name__)


class BedrockProvider(AIProvider):
    def __init__(self):
        self.fallback = MockProvider()
        self.client = None
        self._init_bedrock_client()

    def _init_bedrock_client(self):
        try:
            import boto3
            client_kwargs = {
                "service_name": "bedrock-runtime",
                "region_name": settings.AWS_REGION or "us-east-1"
            }
            if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
                client_kwargs["aws_access_key_id"] = settings.AWS_ACCESS_KEY_ID
                client_kwargs["aws_secret_access_key"] = settings.AWS_SECRET_ACCESS_KEY
                if settings.AWS_SESSION_TOKEN:
                    client_kwargs["aws_session_token"] = settings.AWS_SESSION_TOKEN

            self.client = boto3.client(**client_kwargs)
            logger.info("Bedrock client initialized successfully.")
        except Exception as e:
            logger.warning(f"Could not initialize Amazon Bedrock client ({str(e)}). Falling back to MockProvider.")
            self.client = None

    def provider_name(self) -> str:
        if self.client:
            return f"Amazon Bedrock ({settings.BEDROCK_MODEL_ID})"
        return "Amazon Bedrock (Configured, Fallback Active)"

    def is_cloud(self) -> bool:
        return self.client is not None

    def _invoke_bedrock_claude(self, prompt: str, system_prompt: str) -> Optional[str]:
        if not self.client:
            return None
        try:
            body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 800,
                "system": system_prompt,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.2
            }
            response = self.client.invoke_model(
                modelId=settings.BEDROCK_MODEL_ID,
                body=json.dumps(body),
                contentType="application/json",
                accept="application/json"
            )
            response_body = json.loads(response["body"].read().decode("utf-8"))
            return response_body["content"][0]["text"]
        except Exception as e:
            logger.warning(f"Bedrock invocation failed: {e}. Gracefully using mock fallback.")
            return None

    def explain_message(self, message: str, language: str = "en") -> Dict[str, Any]:
        if not self.client:
            return self.fallback.explain_message(message, language)

        system_prompt = (
            "You are an empathetic, calm, non-technical digital assistant helping less-confident digital users. "
            "Explain unfamiliar digital notifications with absolute simplicity. "
            "Never ask for passwords, OTPs, or financial details. Respond ONLY with valid JSON with keys: "
            "summary, meaning, why_it_matters, next_action, warning, steps (array of step_number, title, instruction), "
            "suggested_task_type (one of 'sample_application', 'document_verification', 'utility_bill')."
        )
        prompt = f"Analyze this notification in language '{language}':\n\"{message}\""

        bedrock_result = self._invoke_bedrock_claude(prompt, system_prompt)
        if bedrock_result:
            try:
                # Find JSON block if wrapped
                clean_json = bedrock_result.strip()
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                data = json.loads(clean_json)
                data["ai_source"] = f"Amazon Bedrock ({settings.BEDROCK_MODEL_ID})"
                return data
            except Exception:
                pass

        # Graceful fallback
        res = self.fallback.explain_message(message, language)
        res["ai_source"] = "Local Demo AI (Bedrock Fallback)"
        return res

    def determine_intent(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        # Fast deterministic intent parsing is reliable, or fallback to mock
        return self.fallback.determine_intent(user_input, context)

    def generate_step_explanation(
        self,
        task_title: str,
        step_title: str,
        instruction: str,
        language: str = "en",
        question: Optional[str] = None
    ) -> Dict[str, Any]:
        if not self.client:
            return self.fallback.generate_step_explanation(task_title, step_title, instruction, language, question)

        system_prompt = (
            "You are a compassionate guide for first-time digital users. Provide reassurance and clear explanation. "
            "Return valid JSON with: plain_english, why_it_matters, what_not_to_do, encouragement."
        )
        prompt = f"Task: {task_title}\nStep: {step_title}\nInstruction: {instruction}\nLanguage: {language}"
        if question and question.strip():
            prompt += f"\nUser Question: {question.strip()}"

        res = self._invoke_bedrock_claude(prompt, system_prompt)
        if res:
            try:
                clean_json = res.strip()
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                return json.loads(clean_json)
            except Exception:
                pass
        return self.fallback.generate_step_explanation(task_title, step_title, instruction, language, question)

    def generate_recovery(
        self,
        task_title: str,
        step_title: str,
        reason: str,
        user_note: Optional[str] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        if not self.client:
            return self.fallback.generate_recovery(task_title, step_title, reason, user_note, language)

        system_prompt = (
            "The user is stuck on a digital task. Give gentle, non-condescending recovery guidance. "
            "Return valid JSON with: reassurance, simpler_instruction, action_items (list of strings), can_rewind_step (boolean)."
        )
        prompt = f"Task: {task_title}\nStep: {step_title}\nUser stuck reason: {reason}\nNote: {user_note}\nLanguage: {language}"
        res = self._invoke_bedrock_claude(prompt, system_prompt)
        if res:
            try:
                clean_json = res.strip()
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                return json.loads(clean_json)
            except Exception:
                pass
        return self.fallback.generate_recovery(task_title, step_title, reason, user_note, language)

    def simplify(self, text: str, language: str = "en") -> str:
        return self.fallback.simplify(text, language)

    def alexa_dialog(
        self,
        user_utterance: str,
        state: Dict[str, Any],
        language: str = "en"
    ) -> Dict[str, Any]:
        return self.fallback.alexa_dialog(user_utterance, state, language)
