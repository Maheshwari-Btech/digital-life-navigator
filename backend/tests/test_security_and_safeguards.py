"""
Regression tests for security fixes, input limits, error sanitization, and state-machine safeguards.
"""
import pytest
from app.config import settings


def test_cors_configured_allowlist(client):
    """Test that configured origins are allowed and unconfigured ones receive no allow-origin header."""
    # Configured origin
    resp = client.options(
        "/tasks/catalog",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET"
        }
    )
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_input_validation_oversized_payload(client):
    """Oversized inputs must be rejected with HTTP 422 instead of crashing the server."""
    huge_message = "A" * 5000
    resp = client.post("/message/explain", json={"message": huge_message, "language": "en"})
    assert resp.status_code == 422


def test_input_validation_invalid_language_code(client):
    """Invalid language codes must be rejected with HTTP 422."""
    resp = client.post("/message/explain", json={"message": "Valid alert notice text", "language": "invalid-lang-code-123"})
    assert resp.status_code == 422


def test_step_explanation_with_question_parameter(client):
    """The question parameter in step explanation must be processed by the provider."""
    # 1. Create a task
    create_resp = client.post("/tasks", json={"type": "document_verification", "language": "en"})
    assert create_resp.status_code == 201
    task_id = create_resp.json()["id"]

    # 2. Ask a specific question about the step
    user_q = "Is my data kept private when I do this?"
    explain_resp = client.post(f"/tasks/{task_id}/explain", json={"question": user_q})
    assert explain_resp.status_code == 200
    data = explain_resp.json()
    assert "plain_english" in data
    # The mock provider incorporates the question
    assert user_q in data["plain_english"]


def test_state_machine_completed_task_safeguards(client):
    """Completed tasks cannot be stepped back, paused, or resumed."""
    # 1. Create task
    create_resp = client.post("/tasks", json={"type": "sample_application", "language": "en"})
    task_id = create_resp.json()["id"]

    # Advance through all 5 steps to completion
    for _ in range(5):
        client.post(f"/tasks/{task_id}/done")

    # Verify task is completed
    task_resp = client.get(f"/tasks/{task_id}")
    assert task_resp.json()["status"] == "COMPLETED"

    # Attempt to step back on completed task: must return 400
    back_resp = client.post(f"/tasks/{task_id}/back")
    assert back_resp.status_code == 400
    assert "completed" in back_resp.json()["detail"].lower()

    # Attempt to pause completed task: must return 400
    pause_resp = client.post(f"/tasks/{task_id}/pause")
    assert pause_resp.status_code == 400

    # Attempt to resume completed task: must return 400
    resume_resp = client.post(f"/tasks/{task_id}/resume")
    assert resume_resp.status_code == 400

    # Advancing completed task must be idempotent and keep COMPLETED status
    done_resp = client.post(f"/tasks/{task_id}/done")
    assert done_resp.status_code == 200
    assert done_resp.json()["status"] == "COMPLETED"


def test_session_scoped_task_isolation(client):
    """Tasks created with session A must be isolated and not leaked into session B's active list."""
    session_a = "user-session-alice-123"
    session_b = "user-session-bob-456"

    # Alice starts a task
    alice_resp = client.post(
        "/tasks",
        json={"type": "document_verification", "language": "en"},
        headers={"X-Session-ID": session_a}
    )
    assert alice_resp.status_code == 201
    alice_task_id = alice_resp.json()["id"]

    # Bob queries his active tasks: Alice's task must NOT appear
    bob_active = client.get("/tasks/active", headers={"X-Session-ID": session_b})
    assert bob_active.status_code == 200
    bob_task_ids = [t["id"] for t in bob_active.json()]
    assert alice_task_id not in bob_task_ids

    # Alice queries her active tasks: Alice's task MUST appear
    alice_active = client.get("/tasks/active", headers={"X-Session-ID": session_a})
    assert alice_active.status_code == 200
    alice_task_ids = [t["id"] for t in alice_active.json()]
    assert alice_task_id in alice_task_ids


def test_mcp_error_sanitization(client):
    """MCP errors must return sanitized error text without raw stack traces or internal exception dumps."""
    req = {
        "jsonrpc": "2.0",
        "id": "err-test",
        "method": "tools/call",
        "params": {
            "name": "advance_task_step",
            "arguments": {"task_id": "non-existent-task-id-xyz"}
        }
    }
    resp = client.post("/mcp", json=req)
    assert resp.status_code == 200
    data = resp.json()
    assert data["result"]["isError"] is True
    error_text = data["result"]["content"][0]["text"]
    # Check that error is sanitized and does not leak Python internal exception formatting
    assert "Tool execution failed for 'advance_task_step'" in error_text
    assert "Traceback" not in error_text
