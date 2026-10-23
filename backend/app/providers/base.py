"""
Abstract base class for AI Providers in Digital Life Navigator.
Allows pluggable switching between MockProvider (₹0 local execution)
and BedrockProvider (AWS Builder Mini-Challenge).
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List


class AIProvider(ABC):
    @abstractmethod
    def provider_name(self) -> str:
        """Returns the human-readable identifier of the provider."""
        pass

    @abstractmethod
    def is_cloud(self) -> bool:
        """Returns True if this provider communicates with external cloud APIs."""
        pass

    @abstractmethod
    def explain_message(self, message: str, language: str = "en") -> Dict[str, Any]:
        """Explains an unfamiliar digital message or notification safely."""
        pass

    @abstractmethod
    def determine_intent(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Identifies user intention from text or spoken conversational utterance."""
        pass

    @abstractmethod
    def generate_step_explanation(
        self,
        task_title: str,
        step_title: str,
        instruction: str,
        language: str = "en",
        question: Optional[str] = None
    ) -> Dict[str, Any]:
        """Explains why a specific task step is important in plain, reassuring language."""
        pass

    @abstractmethod
    def generate_recovery(
        self,
        task_title: str,
        step_title: str,
        reason: str,
        user_note: Optional[str] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        """Generates an adaptive recovery plan when the user gets stuck."""
        pass

    @abstractmethod
    def simplify(self, text: str, language: str = "en") -> str:
        """Simplifies complex or bureaucratic jargon into friendly, non-technical guidance."""
        pass

    @abstractmethod
    def alexa_dialog(
        self,
        user_utterance: str,
        state: Dict[str, Any],
        language: str = "en"
    ) -> Dict[str, Any]:
        """Produces simulated Alexa+ conversational dialogue response."""
        pass
