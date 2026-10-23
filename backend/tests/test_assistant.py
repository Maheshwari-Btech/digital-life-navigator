"""
Tests for Simulated Alexa+ Conversational Assistant.
"""
def test_assistant_status(client):
    response = client.get("/assistant/status")
    assert response.status_code == 200
    data = response.json()
    assert data["alexa_plus_simulation"] == "active"
    assert data["voice_synthesis_ready"] is True
    assert len(data["sample_prompts"]) > 0


def test_assistant_start_task_and_stuck(client):
    # User says: "Help me start an application"
    resp = client.post("/assistant/message", json={
        "user_message": "Help me start my application",
        "language": "en"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "started" in data["alexa_reply"].lower() or "application" in data["alexa_reply"].lower()
    task_id = data["current_task_id"]
    assert task_id is not None
    assert data["current_step"] == 1
    assert data["visual_card"] is not None

    # User says: "I'm stuck"
    resp = client.post("/assistant/message", json={
        "user_message": "I'm stuck, I don't know where to click",
        "current_task_id": task_id,
        "language": "en"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["task_status"] == "RECOVERY"
    assert "okay" in data["alexa_reply"].lower()
    assert data["audio_cue"] == "recovery"

    # User says: "Pause"
    resp = client.post("/assistant/message", json={
        "user_message": "Can I continue later? Save my progress",
        "current_task_id": task_id,
        "language": "en"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["task_status"] == "PAUSED"
    assert "saved" in data["alexa_reply"].lower()
