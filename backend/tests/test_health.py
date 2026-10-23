"""
Tests for Health Check API.
"""
def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert "ai_provider" in data
    assert "ui_label" in data


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Digital Life Navigator" in data["app"]
    assert "status" in data
