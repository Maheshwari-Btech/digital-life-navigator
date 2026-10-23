# Amazon Bedrock Integration & AWS Builder Mini-Challenge

## Overview

Digital Life Navigator integrates **Amazon Bedrock** to satisfy the **AWS Builder Mini-Challenge** while maintaining a strict **₹0 local development cost** via an intelligent mock provider fallback.

---

## 1. Why Bedrock? (Meaningful AWS Usage)

Bedrock is not added as a superficial gimmick. It directly enhances four critical capabilities of Digital Life Navigator:

1. **Jargon Simplification:** Deconstructing confusing bureaucratic and technical language in digital notifications into calm, 6th-grade reading level explanations.
2. **Intent Parsing:** Extracting intent from natural spoken utterances (e.g. *"I uploaded the wrong document, what do I do?"* → `get_stuck_recovery`).
3. **Adaptive Recovery Synthesis:** When a user is stuck, Bedrock dynamically tailors comforting recovery steps based on the user's specific confusion without breaking the task state.
4. **Safety Enforcement:** Bedrock system prompts enforce safety rules: never recommend sharing OTPs, passwords, or clicking unverified links.

---

## 2. Supported Foundation Models

The system is configured to support standard Amazon Bedrock models:
* **Anthropic Claude 3 Haiku** (`anthropic.claude-3-haiku-20240307-v1:0`) — Recommended for lowest latency and empathetic tone.
* **Amazon Nova Micro / Lite** (`amazon.nova-micro-v1:0`) — High-efficiency cloud reasoning.
* **Amazon Titan Text Express** (`amazon.titan-text-express-v1`)

---

## 3. Architecture & Fallback Mechanism

```
                       User Request
                            │
                            ▼
              ┌───────────────────────────┐
              │     Provider Factory      │
              │  (app/providers/factory)  │
              └─────────────┬─────────────┘
                            │
               AI_PROVIDER == 'bedrock'?
                     /             \
                   YES              NO
                   /                 \
                  ▼                   ▼
    ┌───────────────────────────┐   ┌──────────────────────────┐
    │      BedrockProvider      │   │       MockProvider       │
    │ (boto3 bedrock-runtime)   │   │  (100% Local / ₹0 Cost)  │
    └─────────────┬─────────────┘   └──────────────────────────┘
                  │
          Invocation Error?
          (No credentials /
           Auth Failure /
           Network Timeout)
                  │
                 YES ──────────────► Falls back gracefully to MockProvider
                  │                  (Task state is 100% preserved)
                 NO
                  │
                  ▼
          Returns Bedrock
         Structured Guidance
```

### Safety & Resilience Guarantee
* **Zero Crashes:** If AWS credentials are blank, expired, or offline, the user **never sees an unhandled exception or frozen screen**.
* **Truthful UI Badges:** The application honestly indicates whether guidance is powered by `Guidance powered by local demo AI (₹0)` or `AI guidance enabled (Amazon Bedrock)`.

---

## 4. Server-Side Configuration

All AWS calls are made **strictly on the backend**. AWS credentials are never transmitted to or bundled inside client-side JavaScript.

### Environment Variables (`backend/.env`)

```ini
# AI Provider Selection: 'mock' (default) or 'bedrock'
AI_PROVIDER=bedrock

# AWS Region & Credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here
AWS_SESSION_TOKEN=  # optional, for temporary session credentials

# Bedrock Model ID
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

---

## 5. Verification & Testing

The Bedrock integration is tested in `backend/tests/test_providers.py`:
* `test_mock_provider_deterministic`: Verifies deterministic ₹0 behavior.
* `test_bedrock_provider_fallback_without_credentials`: Confirms that `BedrockProvider` initializes and handles missing credentials with zero crashes.
