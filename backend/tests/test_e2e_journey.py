"""
End-to-End Critical Journey Test.
Simulates the complete 15-step demo journey required for the hackathon.
"""
def test_full_critical_journey(client):
    # SCENE 1 & 2: Health and catalog
    health_resp = client.get("/health")
    assert health_resp.status_code == 200
    assert health_resp.json()["status"] == "healthy"

    catalog_resp = client.get("/tasks/catalog")
    assert catalog_resp.status_code == 200
    assert len(catalog_resp.json()) >= 3

    # SCENE 3 & 4: User submits unfamiliar message
    msg_payload = {
        "message": "You are requested to verify your document before continuing your application.",
        "language": "en"
    }
    msg_resp = client.post("/message/explain", json=msg_payload)
    assert msg_resp.status_code == 200
    explanation = msg_resp.json()
    assert explanation["suggested_task_type"] == "document_verification"
    assert "document" in explanation["summary"].lower()
    assert "OTP" in explanation["warning"] or "password" in explanation["warning"]

    # SCENE 5 & 6: Start guided task based on the message
    create_task_payload = {
        "type": explanation["suggested_task_type"],
        "language": "en"
    }
    task_resp = client.post("/tasks", json=create_task_payload)
    assert task_resp.status_code == 201
    task = task_resp.json()
    task_id = task["id"]
    assert task["current_step"] == 1
    assert task["total_steps"] == 5
    assert task["status"] == "IN_PROGRESS"

    # SCENE 7: Complete Step 1
    step_resp = client.post(f"/tasks/{task_id}/done")
    assert step_resp.status_code == 200
    task = step_resp.json()
    assert task["current_step"] == 2
    assert task["steps"][0]["completed"] is True

    # SCENE 8 & 9: User gets stuck on Step 2
    stuck_payload = {
        "reason": "I think I uploaded the wrong document",
        "user_note": "The name might not match."
    }
    stuck_resp = client.post(f"/tasks/{task_id}/stuck", json=stuck_payload)
    assert stuck_resp.status_code == 200
    recovery = stuck_resp.json()
    assert recovery["task_id"] == task_id
    assert "reassurance" in recovery
    assert len(recovery["action_items"]) > 0

    # SCENE 10: Step back to fix mistake
    back_resp = client.post(f"/tasks/{task_id}/back")
    assert back_resp.status_code == 200
    task = back_resp.json()
    assert task["current_step"] == 1

    # Advance back to step 2
    client.post(f"/tasks/{task_id}/done")

    # SCENE 11: User pauses task ("Continue later")
    pause_resp = client.post(f"/tasks/{task_id}/pause")
    assert pause_resp.status_code == 200
    task = pause_resp.json()
    assert task["status"] == "PAUSED"
    assert task["current_step"] == 2

    # SCENE 12 & 13: App reloads, retrieves saved task
    active_resp = client.get("/tasks/active")
    assert active_resp.status_code == 200
    active_tasks = active_resp.json()
    saved = next(t for t in active_tasks if t["id"] == task_id)
    assert saved["status"] == "PAUSED"
    assert saved["current_step"] == 2

    # User clicks "Continue from Step 2"
    resume_resp = client.post(f"/tasks/{task_id}/resume")
    assert resume_resp.status_code == 200
    task = resume_resp.json()
    assert task["status"] == "IN_PROGRESS"
    assert task["current_step"] == 2

    # SCENE 14: User completes remaining steps (2 -> 3 -> 4 -> 5 -> COMPLETED)
    client.post(f"/tasks/{task_id}/done")  # to step 3
    client.post(f"/tasks/{task_id}/done")  # to step 4
    client.post(f"/tasks/{task_id}/done")  # to step 5
    final_resp = client.post(f"/tasks/{task_id}/done")  # complete
    assert final_resp.status_code == 200
    final_task = final_resp.json()
    assert final_task["status"] == "COMPLETED"
    assert all(s["completed"] for s in final_task["steps"])

    # SCENE 15: Simulated Alexa+ experience verification
    alexa_start = client.post("/assistant/message", json={
        "user_message": "Help me start my application",
        "language": "en"
    })
    assert alexa_start.status_code == 200
    alexa_data = alexa_start.json()
    alexa_task_id = alexa_data["current_task_id"]
    assert alexa_task_id is not None
    assert alexa_data["visual_card"] is not None

    alexa_stuck = client.post("/assistant/message", json={
        "user_message": "I'm stuck, I don't know where to click",
        "current_task_id": alexa_task_id,
        "language": "en"
    })
    assert alexa_stuck.status_code == 200
    assert alexa_stuck.json()["task_status"] == "RECOVERY"

    alexa_pause = client.post("/assistant/message", json={
        "user_message": "Can I continue later?",
        "current_task_id": alexa_task_id,
        "language": "en"
    })
    assert alexa_pause.status_code == 200
    assert alexa_pause.json()["task_status"] == "PAUSED"
