# Test Suite & Verification Guide

Digital Life Navigator includes an extensive automated test suite covering unit, integration, and end-to-end user journeys.

---

## 1. Running the Automated Test Suite

### Backend Test Suite (Pytest)

From the project root:

```bash
cd backend
.venv\Scripts\pytest.exe -v
```

*(On Linux / macOS: `.venv/bin/pytest -v`)*

### Test Results

```
============================= test session starts =============================
collected 14 items

tests/test_assistant.py::test_assistant_status PASSED                    [  7%]
tests/test_assistant.py::test_assistant_start_task_and_stuck PASSED      [ 14%]
tests/test_e2e_journey.py::test_full_critical_journey PASSED             [ 21%]
tests/test_health.py::test_health_check PASSED                           [ 28%]
tests/test_health.py::test_root_endpoint PASSED                          [ 35%]
tests/test_message_understanding.py::test_explain_document_verification_message PASSED [ 42%]
tests/test_message_understanding.py::test_explain_utility_bill_message PASSED [ 50%]
tests/test_message_understanding.py::test_multilingual_message_explanation PASSED [ 57%]
tests/test_providers.py::test_mock_provider_deterministic PASSED         [ 64%]
tests/test_providers.py::test_bedrock_provider_fallback_without_credentials PASSED [ 71%]
tests/test_providers.py::test_provider_status_reporter PASSED            [ 78%]
tests/test_tasks.py::test_task_catalog PASSED                            [ 85%]
tests/test_tasks.py::test_task_full_lifecycle PASSED                     [ 92%]
tests/test_tasks.py::test_task_not_found PASSED                          [100%]

======================== 14 passed in 3.38s ========================
```

---

## 2. Frontend Build Verification

To verify that the Next.js frontend compiles cleanly with TypeScript and Tailwind CSS:

```bash
cd frontend
npm run build
```

Expected result:
```
✓ Compiled successfully
✓ Generating static pages using workers (8/8)
✓ Finalizing page optimization
```

---

## 3. End-to-End Critical Journey Test

The file `backend/tests/test_e2e_journey.py` executes the entire 15-step demonstration journey:
1. `GET /health` & `GET /tasks/catalog`: Verifies system operational status.
2. `POST /message/explain`: Submits confusing document verification message and verifies safety warnings.
3. `POST /tasks`: Starts guided task.
4. `POST /tasks/{id}/done`: Completes Step 1.
5. `POST /tasks/{id}/stuck`: Reports mistake and verifies non-destructive recovery plan.
6. `POST /tasks/{id}/back`: Steps back to correct mistake.
7. `POST /tasks/{id}/pause`: Pauses task for later.
8. `GET /tasks/active` & `POST /tasks/{id}/resume`: Restores task at exact saved step.
9. Completes all remaining steps to `COMPLETED`.
10. `POST /assistant/message`: Executes simulated Alexa+ multi-turn voice dialog.

---

## 4. Manual QA Verification Checklist

- [x] **Home Screen:** Renders 3 primary choices with high readability and contrast.
- [x] **Message Understanding:** Explains document verification, utility bill, and KYC messages.
- [x] **Task Execution:** Guides step-by-step with interactive practice sandboxes.
- [x] **Stuck & Recovery:** 5 intuitive stuck reasons provide reassuring action items.
- [x] **Persistence / Resume:** Reloading or opening `/resume` restores paused tasks without data loss.
- [x] **Simulated Alexa+:** Voice toggle reads responses aloud; microphone captures voice queries; visual cards synchronize with task state.
- [x] **Multilingual Support:** Switches smoothly between English, हिन्दी, and मराठी.
- [x] **Zero Cloud Cost:** Runs 100% locally with ₹0 cost out of the box.
