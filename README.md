# Digital Life Navigator

> **Tagline:** “Show me what you’re trying to do. I’ll help you do it.”  
> **Core Principle:** Do not teach technology first. Help the person complete the task first.  
> **Hackathon Tracks:** Amazon Developer Hackathon — **Alexa+** & **AWS Builder Mini-Challenge (Amazon Bedrock)**

---

## Problem

Millions of people can use a smartphone for daily habits like watching videos or texting, but freeze when encountering unfamiliar digital procedures:
* *“What does this notification mean?”*
* *“What should I do next?”*
* *“Which information is this form asking for?”*
* *“I clicked something and now I’m stuck.”*
* *“Can I come back later?”*
* *“I am afraid of making a mistake.”*

Most digital-learning platforms teach abstract concepts or complete long courses. Digital Life Navigator focuses on helping the person **successfully complete their actual task while learning only what they need**, without fear, anxiety, or condescension.

---

## Solution

Digital Life Navigator is a task-oriented guidance system designed with a **"Simple Outside, Sophisticated Inside"** architecture:
* **Simple Outside:** The interface offers three clear primary choices without dashboards, menus, or jargon.
* **Sophisticated Inside:** An authoritative backend state machine maintains persistent task state, manages step progression, handles non-destructive stuck recovery, and integrates conversational intelligence through Amazon Bedrock and a simulated Alexa+ voice layer.

```
Understand ➔ Guide ➔ User Acts ➔ Detect Stuck ➔ Adapt ➔ Remember ➔ Resume ➔ Complete
```

---

## Why It Matters

* **Dignity & Confidence:** The system is calm, friendly, and respectful. It never makes the user feel unintelligent.
* **Non-Destructive Recovery:** When a mistake occurs, the user is never forced to start over from scratch.
* **Zero-Loss Continuity:** Users can step away or pause anytime, returning to resume right at the exact step they left off.
* **Fraud Prevention:** Explicit, proactive warnings prevent users from sharing OTPs, passwords, or sensitive identity documents with bad actors.

---

## Key Features

1. **Understand a Digital Message (Flow A):** Paste any confusing SMS, alert, or notice to receive an immediate plain-language summary, why it matters, what to do, what NOT to do, and a one-click launcher for the associated task.
2. **Complete an Unfamiliar Digital Procedure (Flow B):** Guides users one step at a time with clear instructions, "Why this matters" context, and interactive safe practice sandboxes.
3. **Get Unstuck (Flow C):** Select from 5 intuitive stuck reasons to receive tailored, compassionate recovery steps with safe step-rewind capability.
4. **Continue Later / Resume (Memory):** Authoritative SQLite task persistence stores progress across sessions. Returning users are offered immediate 1-click continuation.
5. **Simulated Alexa+ Voice Experience:** Full-featured conversational voice interface featuring Web Speech synthesis (TTS), microphone recognition (STT), synchronized visual cards, and state tracking (browser simulation; does not require physical Alexa hardware).
6. **AWS Bedrock Integration:** Real server-side Amazon Bedrock foundation model integration (Anthropic Claude 3 Haiku via Bedrock runtime) with automatic ₹0 local fallback.
7. **Multilingual Architecture:** Native support for English, Hindi (हिन्दी), and Marathi (मराठी).

---

## Demo Flow

The application is structured around a 15-step demonstration journey (under 3 minutes):
1. **Open Navigator:** Clean home screen with 3 simple options.
2. **Analyze Message:** Submit: *"You are requested to verify your document before continuing your application."*
3. **Review Plain Guidance:** View plain summary, safety warnings against sharing OTPs, and click *"Help me do this task now"*.
4. **Execute Step 1:** Open application workspace in the safe practice sandbox. Click *"Done, Next Step"*.
5. **Encounter Stuckness:** Click *"I'm Stuck"* on Step 2. Select *"I think I made a mistake"*.
6. **Follow Recovery:** View gentle reassurance: *"That's okay. You do not need to start again."* Step back and correct the input.
7. **Pause Workflow:** Click *"Continue Later"*. Close the browser tab.
8. **Resume Progress:** Reopen Navigator. View the banner: *"Welcome back! You completed 2 of 5 steps. Continue from Step 3?"* Click *"Continue"*.
9. **Complete Task:** Complete remaining steps and view the warm celebration completion card.
10. **Alexa+ Voice Interface:** Open `/assistant`. Speak aloud: *"Alexa, help me start an application"* and *"Alexa, I'm stuck"*.

---

## Architecture

```
+--------------------------------------------------------------------------+
|                        USER INTERACTION SURFACES                        |
|                                                                          |
|  [ Web UI: Simple 3 Choices ]       [ Simulated Alexa+ Voice / Audio ]   |
|   - "I want to do something"         - Glowing Alexa Ring Aura           |
|   - "I don't understand this"        - Web Speech Recognition (Mic)      |
|   - "I'm stuck"                      - Browser Speech Synthesis (TTS)    |
+--------------------------------------------------------------------------+
                                    │
                                    ▼ HTTP / JSON REST APIs
+--------------------------------------------------------------------------+
|                     FASTAPI BACKEND SERVICE (PORT 8000)                  |
|                                                                          |
|  API Routes:                                                             |
|   - /health                 System diagnostics & AI engine indicator     |
|   - /tasks                  Catalog, Task Creation, Progression          |
|   - /tasks/{id}/done        Step progression                             |
|   - /tasks/{id}/back        Non-destructive step rewind                  |
|   - /tasks/{id}/stuck       Adaptive recovery guidance                   |
|   - /tasks/{id}/pause       Task pausing ("Continue Later")             |
|   - /tasks/{id}/resume      Zero-data-loss task resumption               |
|   - /tasks/{id}/explain     Non-condescending step explanations          |
|   - /message/explain        Flow A: Message Understanding Engine         |
|   - /assistant/message      Simulated Alexa+ multi-turn dialogue engine  |
+--------------------------------------------------------------------------+
          │                                           │
          ▼                                           ▼
+----------------------------------+   +-----------------------------------+
|     AUTHORITATIVE TASK ENGINE    |   |         AI PROVIDER LAYER         |
|                                  |   |                                   |
|  - Finite State Machine          |   |  AIProvider (Abstract Base Class) |
|  - Event Audit Logging           |   |       ├── MockProvider (₹0 Local) |
|  - Step Tracking & Validation    |   |       └── BedrockProvider (AWS)   |
|  - Synthetic Practice Sandboxes  |   |           - Claude 3 / Nova       |
+----------------------------------+   +-----------------------------------+
          │
          ▼
+--------------------------------------------------------------------------+
|                      SQLITE DATABASE (PERSISTENCE)                       |
|                                                                          |
|  - tasks       (id, title, type, status, current_step, total_steps)      |
|  - task_steps  (id, task_id, step_number, title, instruction, completed) |
|  - task_events (id, task_id, event_type, payload, created_at)            |
+--------------------------------------------------------------------------+
```

---

## Tech Stack

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React
* **Backend:** Python 3.10+, FastAPI, SQLAlchemy, Pydantic v2, Uvicorn
* **Database:** SQLite (thread-safe, foreign key enforcement, zero external setup)
* **Cloud AI:** Amazon Bedrock (`boto3` runtime) with automatic zero-cost fallback
* **Testing:** Pytest, HTTPX, FastAPI TestClient

---

## AI Architecture

The system uses a strict **`AIProvider` abstraction** so business logic is never coupled to a single vendor:

* **`MockProvider` (Default / ₹0 Cost):**
  * Instant deterministic responses with zero external dependencies.
  * Rich scenario heuristics for KYC, document verification, applications, and utility bills.
  * Multilingual generation in English, Hindi, and Marathi.
* **`BedrockProvider` (AWS Builder Mini-Challenge):**
  * Connects to Amazon Bedrock runtime using server-side AWS credentials.
  * Formats prompts with strict safety guardrails (no OTP requests, 6th-grade reading level).
  * Automatically and invisibly falls back to `MockProvider` if credentials are not configured or network fails, ensuring task state is never lost.

---

## Amazon Alexa+ Simulation

Built specifically for the **Alexa+ track** of the Amazon Developer Hackathon:
* Accessible at the dedicated route `/assistant`.
* Features an animated Alexa-style glowing ring with status pulses.
* Integrates browser speech recognition (Microphone) and speech synthesis (Text-to-Speech) for complete hands-free interaction.
* Emits visual cards (`AlexaVisualCard`) and soft Web Audio chimes for positive confirmations and recovery.
* Note: This is an in-browser conversational simulation of the Alexa+ multi-turn assistant experience; it does not connect to or require a physical Amazon Echo device.

---

## AWS / Bedrock Integration

Digital Life Navigator is eligible for the **AWS Builder Mini-Challenge**:
* Amazon Bedrock is used server-side to analyze unfamiliar digital messages, generate step explanations, and synthesize adaptive recovery guidance.
* Supported model: Anthropic Claude 3 Haiku (`anthropic.claude-3-haiku-20240307-v1:0`) using the Bedrock Messages API format.
* Zero-cost fallback: If AWS credentials are not configured, the app immediately and transparently uses the deterministic `MockProvider` (₹0 cost).
* Documented thoroughly in `docs/aws-integration.md`.

---

## Installation & Setup

### Prerequisites
* **Node.js:** v18.0.0 or later (Node v24 recommended)
* **Python:** v3.10 or later
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/digital-life-navigator.git
cd digital-life-navigator
```

---

## Environment Variables

Copy the sample environment file:

```bash
cp .env.example backend/.env
```

The system runs **100% locally out of the box with ₹0 cost** using `AI_PROVIDER=mock`.

If you wish to test with Amazon Bedrock, add your AWS credentials in `backend/.env`:
```ini
AI_PROVIDER=bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

---

## Running Backend (Windows)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

The FastAPI backend will start at `http://127.0.0.1:8000`.  
Interactive API docs are available at `http://127.0.0.1:8000/docs`.

---

## Running Frontend (Windows)

In a separate terminal window:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## Running Tests

From the `backend` directory:

```powershell
cd backend
.\.venv\Scripts\pytest.exe -v
```

All 20 tests will execute, validating the state machine, mock provider, Bedrock fallback, MCP tool dispatch, and the complete 15-step end-to-end journey.

> **Database Initialization Note:** If starting fresh without an existing `digital_life_navigator.db` file, the backend automatically initializes all tables on startup via `init_db()` in `database.py`. No manual database creation is required.

---

## Project Structure

```
digital-life-navigator/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   └── synthetic_tasks.py     # Safe demo tasks catalog
│   │   ├── models/
│   │   │   └── task.py                # SQLAlchemy Task, Step, Event models
│   │   ├── providers/
│   │   │   ├── base.py                # AIProvider abstract class
│   │   │   ├── mock_provider.py       # Deterministic ₹0 local AI engine
│   │   │   ├── bedrock_provider.py    # AWS Bedrock runtime integration
│   │   │   └── factory.py             # Provider factory & status reporter
│   │   ├── routes/
│   │   │   ├── health.py              # Health check & status badges
│   │   │   ├── tasks.py               # Task CRUD, progression, stuck/resume
│   │   │   ├── message.py             # Flow A message understanding
│   │   │   ├── assistant.py           # Simulated Alexa+ dialogue endpoints
│   │   │   └── mcp.py                 # MCP tool discovery & JSON-RPC dispatcher
│   │   ├── schemas/
│   │   │   ├── task.py                # Pydantic task schemas
│   │   │   ├── message.py             # Message analysis schemas
│   │   │   └── assistant.py           # Alexa conversational schemas
│   │   ├── services/
│   │   │   ├── task_engine.py         # Authoritative backend state machine
│   │   │   ├── message_service.py     # Message deconstruction service
│   │   │   └── alexa_service.py       # Simulated Alexa+ agentic service
│   │   ├── config.py                  # Pydantic settings
│   │   ├── database.py                # SQLite engine & session management
│   │   └── main.py                    # FastAPI application entrypoint
│   ├── tests/
│   │   ├── conftest.py                # Pytest fixtures & in-memory test DB
│   │   ├── test_health.py             # Health check tests
│   │   ├── test_tasks.py              # Progression, pause, resume tests
│   │   ├── test_message_understanding.py # Flow A tests
│   │   ├── test_assistant.py          # Alexa+ simulation tests
│   │   ├── test_providers.py          # Mock & Bedrock fallback tests
│   │   ├── test_mcp.py                # Model Context Protocol tool tests
│   │   └── test_e2e_journey.py        # 15-step end-to-end critical journey
│   ├── requirements.txt               # Backend Python dependencies
│   └── run.py                         # Backend launcher script
├── frontend/
│   ├── app/
│   │   ├── assistant/page.tsx         # Simulated Alexa+ guide page
│   │   ├── message/page.tsx           # Flow A: Message understanding
│   │   ├── resume/page.tsx            # Continue later / resume page
│   │   ├── tasks/
│   │   │   ├── page.tsx               # Task catalog selection
│   │   │   └── [id]/page.tsx          # Guided step-by-step task workspace
│   │   ├── layout.tsx                 # Root layout & typography
│   │   └── page.tsx                   # Home screen (3 primary choices)
│   ├── components/
│   │   ├── ActionButtons.tsx          # Done, Stuck, Back, Pause, Explain
│   │   ├── AppHeader.tsx              # Brand, AI badge, language selector
│   │   ├── CompletionCard.tsx         # Achievement card & safety tips
│   │   ├── MessageExplanationCard.tsx # Structured analysis card
│   │   ├── ResumeTaskCard.tsx         # Saved task resumption card
│   │   ├── SimulatedAlexaAssistant.tsx# Alexa+ voice & visual orb canvas
│   │   ├── StepCard.tsx               # Readable instruction & sandbox
│   │   ├── StuckModal.tsx             # 5 stuck reasons & recovery plan
│   │   ├── TaskProgress.tsx           # Visual progress bar & step dots
│   │   └── WelcomeCard.tsx            # 3 primary product choices
│   ├── lib/
│   │   ├── api.ts                     # Backend REST client
│   │   └── translations.ts            # Multilingual (EN, HI, MR) strings
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   └── package.json                   # Next.js dependencies
├── docs/
│   ├── architecture.md                # System design & FSM specification
│   ├── aws-integration.md             # Amazon Bedrock guide & fallback
│   ├── alexa-simulation.md           # Alexa+ track implementation details
│   ├── testing.md                     # Test suite & verification report
│   ├── demo-script.md                 # 3-minute video demo sequence
│   ├── product-feedback.md            # Feedback for Alexa+ & Bedrock teams
│   └── submission-checklist.md        # Hackathon compliance audit
├── .env.example                       # Safe environment variables template
├── .gitignore                         # Git exclusion rules
├── LICENSE                            # MIT Open Source License
└── README.md                          # Project documentation
```

---

## Security

* **No Secrets Committed:** Verified via `.gitignore` and `.env.example`.
* **Zero Real Personal Data:** All tasks utilize synthetic sample names and dummy document previews.
* **Proactive Fraud Defense:** Prominent warnings instruct users never to input or disclose passwords, OTPs, or financial secrets.
* **Server-Side Credentials:** Any AWS authentication tokens are isolated server-side.

---

## Limitations

1. **Simulated Hardware:** The Alexa+ experience runs in a web browser using Web Speech APIs rather than native Echo device firmware.
2. **Synthetic Sandboxes:** Interactive practice exercises operate on simulated mock inputs rather than modifying real government portals.
3. **Bedrock Model Access:** Access to Amazon Bedrock requires an AWS account with model access granted in AWS Management Console.

---

## Future Improvements

* **WhatsApp / SMS Gateway:** Sending step-by-step guidance directly into lightweight messaging apps.
* **Native Alexa Skill Packaging:** Deploying the intent schemas to the official Alexa Skills Kit once Alexa+ developer participant tools open broadly.
* **OCR Camera Input:** Allowing users to photograph physical paper letters and have Digital Life Navigator automatically decode them into plain guidance.

---

## Hackathon Context

Built for the **Amazon Developer Hackathon**:
* **Primary Track:** Alexa+ (Simulated Alexa+ Web Experience)
* **Mini-Challenge:** AWS Builder (Amazon Bedrock Integration)
* **Target Audience:** First-time, less-confident, and underserved digital users seeking autonomy in unfamiliar online services.

---

## License

This project is licensed under the [MIT License](LICENSE).
