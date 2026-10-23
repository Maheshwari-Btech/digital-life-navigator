"""
Provider Factory to obtain the active AI Provider based on configuration.
"""
from app.config import settings
from app.providers.base import AIProvider
from app.providers.mock_provider import MockProvider
from app.providers.bedrock_provider import BedrockProvider

_provider_instance = None


def get_ai_provider() -> AIProvider:
    """Returns the singleton instance of the configured AI provider."""
    global _provider_instance
    if _provider_instance is None:
        if settings.AI_PROVIDER.lower() == "bedrock":
            _provider_instance = BedrockProvider()
        else:
            _provider_instance = MockProvider()
    return _provider_instance


def get_provider_status() -> dict:
    """Returns metadata about the active provider for honest UI status pills."""
    provider = get_ai_provider()
    is_cloud = provider.is_cloud()
    return {
        "provider": provider.provider_name(),
        "is_cloud": is_cloud,
        "label": "AI guidance enabled (Amazon Bedrock)" if is_cloud else "Guidance powered by local demo AI (₹0)",
        "badge": "AWS Bedrock" if is_cloud else "Local Mock Engine"
    }
