import {
  Task,
  TaskCatalogItem,
  RecoveryResponse,
  ExplainResponse,
  MessageExplanationResponse,
  AlexaMessageResponse,
  HealthStatus,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getClientSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  try {
    let id = localStorage.getItem("digiguide_session_id");
    if (!id) {
      id = "sess_" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("digiguide_session_id", id);
    }
    return id;
  } catch {
    return "default-session";
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const sessionId = getClientSessionId();
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Session-ID": sessionId,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: "Unknown server error" }));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    if (url !== "/health") {
      console.warn(`API Error on ${url}:`, error?.message || error);
    }
    throw new Error(
      error?.message || "We could not connect to the guidance engine right now. Please check if the backend is running."
    );
  }
}

export async function getHealth(): Promise<HealthStatus> {
  return fetchJson<HealthStatus>("/health");
}

export async function getTaskCatalog(): Promise<TaskCatalogItem[]> {
  return fetchJson<TaskCatalogItem[]>("/tasks/catalog");
}

export async function getActiveTasks(): Promise<Task[]> {
  return fetchJson<Task[]>("/tasks/active");
}

export async function createTask(type: string, language: string = "en"): Promise<Task> {
  return fetchJson<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ type, language }),
  });
}

export async function getTask(taskId: string): Promise<Task> {
  return fetchJson<Task>(`/tasks/${taskId}`);
}

export async function advanceStep(taskId: string): Promise<Task> {
  return fetchJson<Task>(`/tasks/${taskId}/done`, {
    method: "POST",
  });
}

export async function stepBack(taskId: string): Promise<Task> {
  return fetchJson<Task>(`/tasks/${taskId}/back`, {
    method: "POST",
  });
}

export async function reportStuck(
  taskId: string,
  reason: string,
  userNote?: string
): Promise<RecoveryResponse> {
  return fetchJson<RecoveryResponse>(`/tasks/${taskId}/stuck`, {
    method: "POST",
    body: JSON.stringify({ reason, user_note: userNote }),
  });
}

export async function pauseTask(taskId: string): Promise<Task> {
  return fetchJson<Task>(`/tasks/${taskId}/pause`, {
    method: "POST",
  });
}

export async function resumeTask(taskId: string): Promise<Task> {
  return fetchJson<Task>(`/tasks/${taskId}/resume`, {
    method: "POST",
  });
}

export async function explainStep(
  taskId: string,
  question?: string
): Promise<ExplainResponse> {
  return fetchJson<ExplainResponse>(`/tasks/${taskId}/explain`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function explainMessage(
  message: string,
  language: string = "en"
): Promise<MessageExplanationResponse> {
  return fetchJson<MessageExplanationResponse>("/message/explain", {
    method: "POST",
    body: JSON.stringify({ message, language }),
  });
}

export async function sendAlexaMessage(
  userMessage: string,
  currentTaskId?: string,
  language: string = "en"
): Promise<AlexaMessageResponse> {
  return fetchJson<AlexaMessageResponse>("/assistant/message", {
    method: "POST",
    body: JSON.stringify({
      user_message: userMessage,
      current_task_id: currentTaskId,
      language,
    }),
  });
}

export async function getAlexaStatus(): Promise<any> {
  return fetchJson<any>("/assistant/status");
}
