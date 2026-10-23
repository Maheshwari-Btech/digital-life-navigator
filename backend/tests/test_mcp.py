"""
Tests for Model Context Protocol (MCP) Server Endpoint.
Validates JSON-RPC 2.0 compliance, tool discovery, and tool execution.
"""
import json


def test_mcp_discovery_get(client):
    """Test public MCP capabilities discovery endpoint."""
    response = client.get("/mcp")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["protocol"] == "Model Context Protocol (MCP)"
    assert data["protocol_version"] == "2025-11-25"
    assert data["server"]["name"] == "digiguide-mcp-server"
    assert data["tools_count"] >= 6
    tool_names = [t["name"] for t in data["tools"]]
    assert "explain_message" in tool_names
    assert "start_guided_task" in tool_names
    assert "get_stuck_recovery" in tool_names


def test_mcp_initialize(client):
    """Test standard MCP initialize handshake."""
    req = {
        "jsonrpc": "2.0",
        "id": "init-1",
        "method": "initialize",
        "params": {
            "protocolVersion": "2025-11-25",
            "capabilities": {},
            "clientInfo": {"name": "test-alexa-agent", "version": "1.0"}
        }
    }
    response = client.post("/mcp", json=req)
    assert response.status_code == 200
    res = response.json()
    assert res["jsonrpc"] == "2.0"
    assert res["id"] == "init-1"
    assert "result" in res
    assert res["result"]["protocolVersion"] == "2025-11-25"
    assert res["result"]["serverInfo"]["name"] == "digiguide-mcp-server"


def test_mcp_tools_list(client):
    """Test standard MCP tools/list method."""
    req = {
        "jsonrpc": "2.0",
        "id": "list-1",
        "method": "tools/list",
        "params": {}
    }
    response = client.post("/mcp", json=req)
    assert response.status_code == 200
    res = response.json()
    assert res["id"] == "list-1"
    tools = res["result"]["tools"]
    assert len(tools) >= 6
    assert any(t["name"] == "explain_message" for t in tools)


def test_mcp_tools_call_explain_message(client):
    """Test MCP tool call for explain_message."""
    req = {
        "jsonrpc": "2.0",
        "id": "call-1",
        "method": "tools/call",
        "params": {
            "name": "explain_message",
            "arguments": {
                "message": "Please verify your document before proceeding with verification.",
                "language": "en"
            }
        }
    }
    response = client.post("/mcp", json=req)
    assert response.status_code == 200
    res = response.json()
    assert res["id"] == "call-1"
    assert "result" in res
    content = res["result"]["content"]
    assert len(content) > 0
    assert content[0]["type"] == "text"
    parsed_text = json.loads(content[0]["text"])
    assert "summary" in parsed_text
    assert "steps" in parsed_text


def test_mcp_tools_call_task_workflow(client):
    """Test end-to-end task progression via MCP tools/call."""
    # 1. Start task
    start_req = {
        "jsonrpc": "2.0",
        "id": "task-start",
        "method": "tools/call",
        "params": {
            "name": "start_guided_task",
            "arguments": {
                "task_type": "document_verification",
                "language": "en"
            }
        }
    }
    start_res = client.post("/mcp", json=start_req).json()
    task_data = json.loads(start_res["result"]["content"][0]["text"])
    task_id = task_data["task_id"]
    assert task_id is not None
    assert task_data["current_step"] == 1

    # 2. Advance task step
    adv_req = {
        "jsonrpc": "2.0",
        "id": "task-adv",
        "method": "tools/call",
        "params": {
            "name": "advance_task_step",
            "arguments": {"task_id": task_id}
        }
    }
    adv_res = client.post("/mcp", json=adv_req).json()
    adv_data = json.loads(adv_res["result"]["content"][0]["text"])
    assert adv_data["current_step"] == 2

    # 3. Request stuck recovery
    stuck_req = {
        "jsonrpc": "2.0",
        "id": "task-stuck",
        "method": "tools/call",
        "params": {
            "name": "get_stuck_recovery",
            "arguments": {
                "task_id": task_id,
                "reason": "I don't know where to click"
            }
        }
    }
    stuck_res = client.post("/mcp", json=stuck_req).json()
    stuck_data = json.loads(stuck_res["result"]["content"][0]["text"])
    assert "reassurance" in stuck_data
    assert "simpler_instruction" in stuck_data


def test_mcp_invalid_method(client):
    """Test standard JSON-RPC error on unsupported method."""
    req = {
        "jsonrpc": "2.0",
        "id": "err-1",
        "method": "unknown/method",
        "params": {}
    }
    response = client.post("/mcp", json=req)
    assert response.status_code == 200
    res = response.json()
    assert "error" in res
    assert res["error"]["code"] == -32601
