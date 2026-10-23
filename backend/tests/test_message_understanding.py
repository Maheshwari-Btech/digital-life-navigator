"""
Tests for Flow A: Message Understanding Engine.
"""
def test_explain_document_verification_message(client):
    payload = {
        "message": "You are requested to verify your document before continuing your application.",
        "language": "en"
    }
    response = client.post("/message/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "meaning" in data
    assert "why_it_matters" in data
    assert "next_action" in data
    assert "warning" in data
    assert len(data["steps"]) >= 2
    assert data["suggested_task_type"] == "document_verification"
    # Ensure no dangerous instructions
    assert "OTP" in data["warning"] or "password" in data["warning"]


def test_explain_utility_bill_message(client):
    payload = {
        "message": "Your electricity bill for consumer 10098234 is due in 3 days. Please pay ₹1450.",
        "language": "en"
    }
    response = client.post("/message/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["suggested_task_type"] == "utility_bill"
    assert "Consumer ID" in data["next_action"] or "Consumer" in str(data["steps"])


def test_multilingual_message_explanation(client):
    payload_hi = {
        "message": "You are requested to verify your identity document.",
        "language": "hi"
    }
    response = client.post("/message/explain", json=payload_hi)
    assert response.status_code == 200
    data = response.json()
    assert data["language"] == "hi"
    assert "दस्तावेज़" in data["summary"]
