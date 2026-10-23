# Simulated Alexa+ Experience — Amazon Developer Hackathon

## Track Selection
* **Primary Track:** Alexa+
* **Implementation Strategy:** Simulated Alexa+ Web Experience (Permitted under Hackathon Rules)

---

## 1. Why a Simulated Alexa+ Experience?

The Amazon Developer Hackathon rules permit developers who do not have access to internal/gated Alexa+ developer previews to build a **web-based simulated Alexa+ experience** using their own agentic and AI tools.

Rather than a static mockup, Digital Life Navigator provides an **active, interactive simulation** running real code that demonstrates how Alexa+ could assist a less-confident digital user in the real world.

---

## 2. Core Capabilities Demonstrated

1. **Conversational Multi-Turn Interaction:** The user can speak or type in natural language rather than clicking buttons.
2. **Task-Aware Guidance:** Alexa+ is directly connected to the backend `TaskEngine` and tracks the active task ID, current step, and overall status.
3. **Voice Input & Speech Output:**
   * **Text-to-Speech (TTS):** Uses the browser SpeechSynthesis API with adjusted rate (0.95) and pitch for calm, clear articulation.
   * **Speech-to-Text (STT):** Uses the Web Speech Recognition API with a microphone trigger, gracefully falling back to text entry if speech recognition is unsupported.
4. **Visual Display Cards:** Alexa returns synchronized visual cards (`AlexaVisualCard`) formatted for screen-based Alexa devices (Echo Show, Fire TV, or Alexa app).
5. **Adaptive Recovery:** When the user says *"I'm stuck"* or *"I think I made a mistake"*, Alexa provides reassuring guidance, prevents panic, and suggests non-destructive recovery steps.
6. **Voice-Driven Pause & Resume:**
   * *"Alexa, can I do this later?"* → Task is saved at the current step in SQLite.
   * *"Alexa, resume my application"* → Task resumes right where the user left off.

---

## 3. Real vs. Simulated Distinction

To maintain total hackathon integrity and compliance:

| Component | Status | Details |
| :--- | :--- | :--- |
| **Model Context Protocol (MCP) Server** | **REAL** | Open-standard MCP endpoint `/mcp` handling JSON-RPC 2.0 tool discovery and execution |
| **Conversational Agent Engine** | **REAL** | Powered by backend `AlexaService` and `AIProvider` |
| **State Machine & Persistence** | **REAL** | Authoritative SQLite database storing tasks, steps, events |
| **Voice Speech Synthesis (TTS)** | **REAL** | Native Web Speech API rendering spoken audio responses |
| **Voice Microphone Input (STT)**| **REAL** | Native Web Speech Recognition API parsing user voice |
| **Amazon Bedrock Reasoning** | **REAL (When configured)** | Server-side boto3 Bedrock invocation with local fallback |
| **Alexa Device Hardware Frame** | **SIMULATED** | Web component with glowing Alexa ring and visual card canvas |
| **Production Alexa Skill Gateway**| **SIMULATED / MCP** | Both REST endpoint `/assistant/message` and standard JSON-RPC 2.0 `/mcp` tool provider |

---

## 4. Key Alexa Voice Commands to Demo

* *"Alexa, help me start an application"*
* *"Alexa, explain what this document verification message means"*
* *"Alexa, I finished this step"* / *"Done"*
* *"Alexa, I'm stuck. I don't know where to click"*
* *"Alexa, can I continue later?"*
* *"Alexa, resume my task"*
