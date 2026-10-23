"""
Model Context Protocol (MCP) Server Endpoint for DigiGuide / Digital Life Navigator.
Implements the open MCP standard over JSON-RPC 2.0.
Satisfies the Amazon Developer Hackathon Alexa+ track requirement for self-hosted MCP servers.
Allows external AI agents (Alexa+, Claude, Bedrock Agents) to discover and call task navigation tools.
"""
import json
import logging
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.task_engine import TaskEngine
from app.providers.factory import get_ai_provider
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mcp", tags=["Model Context Protocol (MCP)"])

# Protocol metadata
MCP_PROTOCOL_VERSION = "2025-11-25"
SERVER_INFO = {
    "name": "digiguide-mcp-server",
    "version": "1.0.0",
    "description": "DigiGuide Model Context Protocol server for step-by-step digital guidance and recovery."
}

# Standard MCP Tools Definition
MCP_TOOLS: List[Dict[str, Any]] = [
    {
        "name": "explain_message",
        "description": "Explains an unfamiliar digital SMS, notification, or document verification notice in plain, reassuring language with anti-scam advice.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "description": "The confusing alert or notification text to explain."
                },
                "language": {
                    "type": "string",
                    "enum": ["en", "hi", "mr"],
                    "default": "en",
                    "description": "Language for explanation ('en' for English, 'hi' for Hindi, 'mr' for Marathi)."
                }
            },
            "required": ["message"]
        }
    },
    {
        "name": "list_available_tasks",
        "description": "Lists all safe, synthetic practice tasks available in the catalog (e.g. sample online application, document verification, utility bill payment).",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "start_guided_task",
        "description": "Starts a new guided task workflow and returns task ID, total steps, and the first instruction.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "task_type": {
                    "type": "string",
                    "description": "Identifier of task from catalog (e.g., 'sample_application', 'document_verification', 'utility_bill_payment')."
                },
                "language": {
                    "type": "string",
                    "enum": ["en", "hi", "mr"],
                    "default": "en",
                    "description": "Preferred language."
                }
            },
            "required": ["task_type"]
        }
    },
    {
        "name": "advance_task_step",
        "description": "Marks the current step of a guided task as completed and advances to the next step.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "string",
                    "description": "The active task UUID."
                }
            },
            "required": ["task_id"]
        }
    },
    {
        "name": "get_stuck_recovery",
        "description": "Generates a calm, non-condescending adaptive recovery plan when a user is confused, stuck, or thinks they made a mistake.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "string",
                    "description": "The active task UUID."
                },
                "reason": {
                    "type": "string",
                    "description": "Why the user is stuck (e.g. 'I do not know where to click', 'I think I made a mistake')."
                },
                "user_note": {
                    "type": "string",
                    "description": "Optional details or observation from the user."
                }
            },
            "required": ["task_id", "reason"]
        }
    },
    {
        "name": "get_task_status",
        "description": "Retrieves the authoritative current state, step number, total steps, and completion status of a task.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "string",
                    "description": "The active task UUID."
                }
            },
            "required": ["task_id"]
        }
    }
]


def _jsonrpc_error(req_id: Any, code: int, message: str, data: Any = None) -> Dict[str, Any]:
    err = {"code": code, "message": message}
    if data is not None:
        err["data"] = data
    return {"jsonrpc": "2.0", "id": req_id, "error": err}


def _jsonrpc_result(req_id: Any, result: Any) -> Dict[str, Any]:
    return {"jsonrpc": "2.0", "id": req_id, "result": result}


@router.get("", summary="MCP Server Discovery & Capabilities")
def get_mcp_info():
    """
    Public discovery endpoint for MCP clients.
    Returns server info, supported protocol version, and available tool declarations.
    """
    return {
        "status": "online",
        "protocol": "Model Context Protocol (MCP)",
        "protocol_version": MCP_PROTOCOL_VERSION,
        "server": SERVER_INFO,
        "endpoint": "/mcp",
        "transport": "JSON-RPC 2.0 over HTTP POST",
        "tools_count": len(MCP_TOOLS),
        "tools": MCP_TOOLS
    }


@router.post("", summary="MCP JSON-RPC 2.0 Dispatcher")
async def handle_mcp_rpc(request: Request, db: Session = Depends(get_db)):
    """
    Main MCP JSON-RPC 2.0 handler.
    Supports standard MCP methods: initialize, ping, tools/list, and tools/call.
    """
    try:
        payload = await request.json()
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=_jsonrpc_error(None, -32700, "Parse error: Invalid JSON")
        )

    if not isinstance(payload, dict):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=_jsonrpc_error(None, -32600, "Invalid Request: Payload must be a JSON object")
        )

    req_id = payload.get("id")
    method = payload.get("method")
    params = payload.get("params", {})
    if not method:
        return _jsonrpc_error(req_id, -32600, "Invalid Request: 'method' field is required")
    if not isinstance(params, dict):
        return _jsonrpc_error(req_id, -32602, "Invalid params: 'params' must be an object")

    # 1. initialize
    if method == "initialize":
        return _jsonrpc_result(
            req_id,
            {
                "protocolVersion": MCP_PROTOCOL_VERSION,
                "capabilities": {
                    "tools": {
                        "listChanged": False
                    }
                },
                "serverInfo": SERVER_INFO
            }
        )

    # 2. ping
    if method == "ping":
        return _jsonrpc_result(req_id, {})

    # 3. tools/list
    if method == "tools/list":
        return _jsonrpc_result(req_id, {"tools": MCP_TOOLS})

    # 4. tools/call
    if method == "tools/call":
        tool_name = params.get("name")
        args = params.get("arguments", {})
        if not isinstance(args, dict):
            return _jsonrpc_error(req_id, -32602, "Invalid params: 'arguments' must be an object")

        engine = TaskEngine(db)
        ai = get_ai_provider()

        try:
            if tool_name == "explain_message":
                message = args.get("message", "")
                language = args.get("language", "en")
                explanation = ai.explain_message(message=message, language=language)
                return _jsonrpc_result(
                    req_id,
                    {
                        "content": [
                            {
                                "type": "text",
                                "text": json.dumps(explanation, indent=2, ensure_ascii=False)
                            }
                        ]
                    }
                )

            elif tool_name == "list_available_tasks":
                catalog = engine.list_catalog()
                return _jsonrpc_result(
                    req_id,
                    {
                        "content": [
                            {
                                "type": "text",
                                "text": json.dumps(catalog, indent=2)
                            }
                        ]
                    }
                )

            elif tool_name == "start_guided_task":
                task_type = args.get("task_type")
                language = args.get("language", "en")
                task = engine.create_task(task_type=task_type, language=language)
                first_step = task.steps[0] if task.steps else None
                summary = {
                    "task_id": task.id,
                    "title": task.title,
                    "status": task.status.value,
                    "total_steps": task.total_steps,
                    "current_step": task.current_step,
                    "first_step_instruction": first_step.instruction if first_step else None
                }
                return _jsonrpc_result(
                    req_id,
                    {
                        "content": [
                            {
                                "type": "text",
                                "text": json.dumps(summary, indent=2)
                            }
                        ]
                    }
                )

            elif tool_name == "advance_task_step":
                task_id = args.get("task_id")
                updated_task = engine.advance_step(task_id)
                summary = {
                    "task_id": updated_task.id,
                    "current_step": updated_task.current_step,
                    "total_steps": updated_task.total_steps,
                    "status": updated_task.status.value
                }
                return _jsonrpc_result(
                    req_id,
                    {
                        "content": [
                            {
                                "type": "text",
                                "text": json.dumps(summary, indent=2)
                            }
                        ]
                    }
                )

            elif tool_name == "get_stuck_recovery":
                task_id = args.get("task_id")
                reason = args.get("reason", "I am stuck")
                user_note = args.get("user_note")
                recovery = engine.mark_stuck(task_id, reason, user_note)
                return _jsonrpc_result(
                    req_id,
                    {
                        "content": [
                            {
                                "type": "text",
                                "text": json.dumps(recovery, indent=2)
                            }
                        ]
                    }
                )

            elif tool_name == "get_task_status":
                task_id = args.get("task_id")
                task = engine.get_task(task_id)
                summary = {
                    "task_id": task.id,
                    "title": task.title,
                    "status": task.status.value,
                    "current_step": task.current_step,
                    "total_steps": task.total_steps,
                    "language": task.language
                }
                return _jsonrpc_result(
                    req_id,
                    {
                        "content": [
                            {
                                "type": "text",
                                "text": json.dumps(summary, indent=2)
                            }
                        ]
                    }
                )

            else:
                return _jsonrpc_error(req_id, -32601, f"Unknown tool name: {tool_name}")

        except Exception as e:
            logger.error(f"Error executing MCP tool {tool_name}: {str(e)}", exc_info=True)
            return _jsonrpc_result(
                req_id,
                {
                    "isError": True,
                    "content": [
                        {
                            "type": "text",
                            "text": f"Tool execution failed for '{tool_name}'. Please verify parameters and try again."
                        }
                    ]
                }
            )

    return _jsonrpc_error(req_id, -32601, f"Method not supported: {method}")
