export type TaskState = 
  | "NEW"
  | "UNDERSTANDING"
  | "IN_PROGRESS"
  | "STUCK"
  | "RECOVERY"
  | "PAUSED"
  | "COMPLETED";

export interface TaskStep {
  id?: number;
  step_number: number;
  title: string;
  instruction: string;
  explanation: string;
  simplified_hint?: string;
  recovery_guidance?: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  type: string;
  status: TaskState;
  current_step: number;
  total_steps: number;
  language: string;
  context_data?: Record<string, any>;
  steps: TaskStep[];
  created_at: string;
  updated_at: string;
}

export interface TaskCatalogItem {
  type: string;
  title: string;
  description: string;
  estimated_minutes: number;
  total_steps: number;
  badge: string;
}

export interface RecoveryResponse {
  task_id: string;
  current_step: number;
  reason: string;
  reassurance: string;
  simpler_instruction: string;
  action_items: string[];
  can_rewind_step: boolean;
}

export interface ExplainResponse {
  task_id: string;
  step_number: number;
  title: string;
  plain_english: string;
  why_it_matters: string;
  what_not_to_do: string;
  encouragement: string;
}

export interface MessageStepItem {
  step_number: number;
  title: string;
  instruction: string;
}

export interface MessageExplanationResponse {
  summary: string;
  meaning: string;
  why_it_matters: string;
  next_action: string;
  warning: string;
  steps: MessageStepItem[];
  suggested_task_type?: string;
  language: string;
  ai_source: string;
}

export interface AlexaVisualCard {
  title: string;
  content: string;
  step_number?: number;
  total_steps?: number;
  status?: string;
  action_prompt?: string;
}

export interface AlexaMessageResponse {
  alexa_reply: string;
  speech_text: string;
  visual_card?: AlexaVisualCard;
  current_task_id?: string;
  current_step?: number;
  task_status?: string;
  quick_suggestions: string[];
  audio_cue?: string;
  ai_source: string;
}

export interface HealthStatus {
  status: string;
  app: string;
  version: string;
  database: string;
  ai_provider: string;
  is_cloud_ai: boolean;
  ui_label: string;
  ui_badge: string;
}
