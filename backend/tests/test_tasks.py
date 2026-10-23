"""
Comprehensive tests for Task Engine, state machine, progression, stuck/recovery, pause/resume.
"""
def test_task_catalog(client):
    response = client.get("/tasks/catalog")
    assert response.status_code == 200
    catalog = response.json()
    assert len(catalog) >= 3
    types = [t["type"] for t in catalog]
    assert "sample_application" in types
    assert "document_verification" in types
    assert "utility_bill" in types


def test_task_full_lifecycle(client):
    # 1. Create a task
    create_payload = {
        "type": "sample_application",
        "language": "en"
    }
    resp = client.post("/tasks", json=create_payload)
    assert resp.status_code == 201
    task = resp.json()
    task_id = task["id"]
    assert task["current_step"] == 1
    assert task["total_steps"] == 5
    assert task["status"] == "IN_PROGRESS"
    assert len(task["steps"]) == 5

    # 2. Complete Step 1
    resp = client.post(f"/tasks/{task_id}/done")
    assert resp.status_code == 200
    task = resp.json()
    assert task["current_step"] == 2
    assert task["steps"][0]["completed"] is True
    assert task["status"] == "IN_PROGRESS"

    # 3. User gets stuck on Step 2
    stuck_payload = {
        "reason": "I think I made a mistake",
        "user_note": "I clicked the wrong section."
    }
    resp = client.post(f"/tasks/{task_id}/stuck", json=stuck_payload)
    assert resp.status_code == 200
    recovery = resp.json()
    assert recovery["task_id"] == task_id
    assert recovery["current_step"] == 2
    assert "reassurance" in recovery
    assert len(recovery["action_items"]) > 0

    # Verify task state transitioned to RECOVERY
    resp = client.get(f"/tasks/{task_id}")
    task = resp.json()
    assert task["status"] == "RECOVERY"

    # 4. Step back test
    resp = client.post(f"/tasks/{task_id}/back")
    assert resp.status_code == 200
    task = resp.json()
    assert task["current_step"] == 1

    # Move back forward to Step 2
    resp = client.post(f"/tasks/{task_id}/done")
    assert resp.status_code == 200
    task = resp.json()
    assert task["current_step"] == 2

    # 5. Explain Step 2
    resp = client.post(f"/tasks/{task_id}/explain", json={"question": "What is this asking for?"})
    assert resp.status_code == 200
    exp = resp.json()
    assert exp["step_number"] == 2
    assert "plain_english" in exp
    assert "why_it_matters" in exp

    # 6. Pause Task ("Continue later")
    resp = client.post(f"/tasks/{task_id}/pause")
    assert resp.status_code == 200
    task = resp.json()
    assert task["status"] == "PAUSED"
    assert task["current_step"] == 2

    # Check active/paused tasks query
    resp = client.get("/tasks/active")
    assert resp.status_code == 200
    active_tasks = resp.json()
    assert any(t["id"] == task_id for t in active_tasks)

    # 7. Resume Task
    resp = client.post(f"/tasks/{task_id}/resume")
    assert resp.status_code == 200
    task = resp.json()
    assert task["status"] == "IN_PROGRESS"
    assert task["current_step"] == 2

    # 8. Complete remaining steps (2 -> 3 -> 4 -> 5 -> COMPLETED)
    client.post(f"/tasks/{task_id}/done")  # to step 3
    client.post(f"/tasks/{task_id}/done")  # to step 4
    client.post(f"/tasks/{task_id}/done")  # to step 5
    resp = client.post(f"/tasks/{task_id}/done")  # final completion
    assert resp.status_code == 200
    final_task = resp.json()
    assert final_task["status"] == "COMPLETED"
    assert all(s["completed"] is True for s in final_task["steps"])


def test_task_not_found(client):
    resp = client.get("/tasks/non-existent-uuid")
    assert resp.status_code == 404
