"""
Tests for AI Providers (MockProvider & BedrockProvider graceful fallback).
"""
from app.providers.mock_provider import MockProvider
from app.providers.bedrock_provider import BedrockProvider
from app.providers.factory import get_ai_provider, get_provider_status


def test_mock_provider_deterministic():
    provider = MockProvider()
    assert provider.provider_name() is not None
    assert provider.is_cloud() is False

    exp = provider.explain_message("Please verify your document before proceeding.")
    assert "document" in exp["summary"].lower()
    assert len(exp["steps"]) > 0

    intent = provider.determine_intent("I am stuck on this step")
    assert intent["intent"] == "get_stuck_recovery"

    recovery = provider.generate_recovery("Application", "Step 2", "I think I made a mistake")
    assert "reassurance" in recovery
    assert len(recovery["action_items"]) > 0


def test_bedrock_provider_fallback_without_credentials():
    # Without valid credentials or when offline, BedrockProvider must NOT crash.
    # It must cleanly fall back to MockProvider.
    provider = BedrockProvider()
    exp = provider.explain_message("Your electricity bill is due.")
    assert exp is not None
    assert "bill" in exp["summary"].lower()


def test_provider_status_reporter():
    status = get_provider_status()
    assert "provider" in status
    assert "label" in status
    assert "badge" in status
