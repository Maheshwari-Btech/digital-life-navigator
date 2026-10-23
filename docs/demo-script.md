# 3-Minute Hackathon Demo Script & Video Sequence

**Target Duration:** < 3 minutes  
**Goal:** Demonstrate the product's calm simplicity, agentic state machine, adaptive recovery, resume persistence, and simulated Alexa+ experience.

---

## Timestamp Breakdown

### 0:00 – 0:20 | The Problem
* **Visual:** Close-up of a phone showing a confusing alert: *"You are requested to verify your document before continuing your application."*
* **Voiceover:**  
  *"Millions of people can use a smartphone to watch videos or chat, but freeze when an unfamiliar digital task appears. They aren't looking for a multi-hour computer course—they just want to complete the task in front of them without fear of making a costly mistake."*

---

### 0:20 – 0:40 | Introducing Digital Life Navigator
* **Visual:** Open `http://localhost:3000`. Show the clean, friendly home screen with only 3 choices:
  1. *“I want to do something”*
  2. *“I don’t understand this message”*
  3. *“I’m stuck”*
* **Voiceover:**  
  *"This is Digital Life Navigator. Our core philosophy is simple: Do not teach technology first. Help the person complete the task first."*

---

### 0:40 – 1:30 | Core Guided Workflow (Flow A & Flow B)
* **Visual:**
  1. Click **“I don’t understand this message”**.
  2. Select the sample: *"You are requested to verify your document before continuing your application."*
  3. Click **“Explain this message”**.
  4. Highlight the plain-English meaning, why it matters, and the clear warning: *“Never share bank OTPs or secret passwords.”*
  5. Click **“Help me do this task now”**.
  6. The system launches the guided task. Show Step 1: *Open the application section*. User practices in the safe sandbox and clicks **“Done, Next Step”**.
* **Voiceover:**  
  *"The navigator explains what the message means in plain words and warns against fraud. With one click, it transitions the user into a step-by-step guided task with interactive practice sandboxes."*

---

### 1:30 – 1:55 | Stuck & Adaptive Recovery (Flow C)
* **Visual:**
  1. On Step 2, user clicks **“I’m Stuck”**.
  2. The modal pops up. User clicks **“I think I made a mistake”**.
  3. Show the calm reassurance: *“That's okay. You do not need to start again.”*
  4. Show the action checklist and the option to safely step back.
  5. User clicks **“I did it, let's continue”**.
* **Voiceover:**  
  *"When a user gets stuck, most apps fail them. Digital Life Navigator provides compassionate, non-condescending recovery without destroying the user's progress or forcing them to restart."*

---

### 1:55 – 2:15 | Pause & Resume Persistence
* **Visual:**
  1. User clicks **“Continue Later”**.
  2. Show the confirmation: *“Your task is safely paused.”*
  3. Refresh the browser and go to the home page or `/resume`.
  4. Show the banner: *“Welcome back! You completed 2 of 5 steps. Continue from Step 3?”*
  5. Click **“Continue”** and show immediate resumption right at Step 3.
* **Voiceover:**  
  *"Digital Life Navigator remembers. You can step away anytime, close your phone, and resume exactly where you left off without repeating completed steps."*

---

### 2:15 – 2:40 | Simulated Alexa+ & AWS Bedrock
* **Visual:**
  1. Navigate to `/assistant`.
  2. Show the glowing Alexa+ ring orb.
  3. Speak or type: *“Alexa, help me start an application.”*
  4. Hear Alexa’s spoken speech response and see the synchronized visual card update.
  5. Say: *“I’m stuck.”*
  6. Hear Alexa respond with gentle recovery instructions.
* **Voiceover:**  
  *"For the Amazon Developer Hackathon, we created a simulated Alexa+ voice experience. Powered by our authoritative backend task engine and Amazon Bedrock, users can navigate digital services hands-free using natural voice dialog."*

---

### 2:40 – 3:00 | Architecture & Closing Statement
* **Visual:**
  1. Quick flash of architecture diagram (`docs/architecture.md`) showing FastAPI, SQLite, and Amazon Bedrock with ₹0 local fallback.
  2. Final shot of the product tagline.
* **Voiceover:**  
  *"Digital Life Navigator runs 100% locally at ₹0 cost, supports Amazon Bedrock for advanced cloud intelligence, and features multilingual support in English, Hindi, and Marathi. Digital life doesn't have to be terrifying. Thank you."*
