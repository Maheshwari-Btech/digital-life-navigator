"""
Message Understanding Engine Service (Flow A).
Analyzes unfamiliar digital messages/notifications into plain language,
identifies why they matter, warns against fraud/mistakes, and offers direct task guidance.
"""
from typing import Dict, Any
from app.providers.factory import get_ai_provider


class MessageService:
    def __init__(self):
        self.ai = get_ai_provider()

    def explain(self, message: str, language: str = "en") -> Dict[str, Any]:
        cleaned = message.strip()
        result = self.ai.explain_message(cleaned, language)
        return result
