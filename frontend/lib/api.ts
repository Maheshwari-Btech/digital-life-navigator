import {
  Task,
  TaskCatalogItem,
  RecoveryResponse,
  ExplainResponse,
  MessageExplanationResponse,
  AlexaMessageResponse,
  HealthStatus,
} from "@/types";

// Backend API URL
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

// Generate or retrieve the user's session ID
function getClientSessionId(): string {
  if (typeof window === "undefined") {
    return "server-session";
  }

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

// Common API request handler
async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const sessionId = getClientSessionId();

  let response: Response;

  try {
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Session-ID": sessionId,
        ...options?.headers,
      },
    });
  } catch (error) {
    console.error(`Network error on ${url}:`, error);

    throw new Error(
      `Cannot connect to the backend at ${API_BASE}. Check that the backend is running and the API URL is correct.`
    );
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ detail: response.statusText }));

    const message =
      typeof errorData.detail === "string"
        ? errorData.detail
        : `Request failed with status ${response.status}`;

    console.error(`API error on ${url}:`, response.status, message);

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

// Check backend health
export async function getHealth(): Promise<HealthStatus> {
  return fetchJson<HealthStatus>("/health");
}

// Get available guided tasks
export async function getTaskCatalog(): Promise<TaskCatalogItem[]> {
  const data = await fetchJson<TaskCatalogItem[]>("/tasks/catalog");

  if (!Array.isArray(data)) {
    throw new Error("The backend returned an invalid task catalog.");
  }

  return data;
}

// Get active tasks for the current session
export async function getActiveTasks(): Promise<Task[]> {
  return fetchJson<Task[]>("/tasks/active");
}

// Create a new guided task
export async function createTask(
  type: string,
  language: string = "en"
): Promise<Task> {
  return fetchJson<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ type, language }),
  });
}

// Get a specific task
export async function getTask(taskId: string): Promise<Task> {
  return fetchJson<Task>(`/tasks/${encodeURIComponent(taskId)}`);
}

// Advance to the next step
export async function advanceStep(taskId: string): Promise<Task> {
  return fetchJson<Task>(
    `/tasks/${encodeURIComponent(taskId)}/done`,
    { method: "POST" }
  );
}

// Return to the previous step
export async function stepBack(taskId: string): Promise<Task> {
  return fetchJson<Task>(
    `/tasks/${encodeURIComponent(taskId)}/back`,
    { method: "POST" }
  );
}

// Report that the user is stuck
export async function reportStuck(
  taskId: string,
  reason: string,
  userNote?: string
): Promise<RecoveryResponse> {
  return fetchJson<RecoveryResponse>(
    `/tasks/${encodeURIComponent(taskId)}/stuck`,
    {
      method: "POST",
      body: JSON.stringify({
        reason,
        user_note: userNote,
      }),
    }
  );
}

// Pause a task
export async function pauseTask(taskId: string): Promise<Task> {
  return fetchJson<Task>(
    `/tasks/${encodeURIComponent(taskId)}/pause`,
    { method: "POST" }
  );
}

// Resume a task
export async function resumeTask(taskId: string): Promise<Task> {
  return fetchJson<Task>(
    `/tasks/${encodeURIComponent(taskId)}/resume`,
    { method: "POST" }
  );
}

// Explain the current task step
export async function explainStep(
  taskId: string,
  question?: string
): Promise<ExplainResponse> {
  return fetchJson<ExplainResponse>(
    `/tasks/${encodeURIComponent(taskId)}/explain`,
    {
      method: "POST",
      body: JSON.stringify({ question }),
    }
  );
}

// Explain a message in simple language
export async function explainMessage(
  message: string,
  language: string = "en"
): Promise<MessageExplanationResponse> {
  return fetchJson<MessageExplanationResponse>("/message/explain", {
    method: "POST",
    body: JSON.stringify({ message, language }),
  });
}

// Send a message to the voice assistant
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

// Get voice assistant status
export async function getAlexaStatus(): Promise<any> {
  return fetchJson<any>("/assistant/status");
}