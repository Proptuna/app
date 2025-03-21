export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  toolUse?: ToolUse | null;
  documentReference?: DocumentReference | null;
  followUpMessages?: Message[];
}

export interface ToolUse {
  name: string;
  args: any;
  result?: any;
  status: 'started' | 'completed' | 'failed';
  // Keep old fields for backward compatibility
  toolName?: string;
  toolInput?: any;
  toolOutput?: any;
}

export interface MaintenanceTask {
  property: string;
  contact: string;
  description: string;
  priority: 'emergency' | 'high' | 'medium' | 'low';
  status?: string;
  id?: string;
  created_at?: string;
}

export interface FollowUpRequest {
  question: string;
  reason: string;
  contactInfo?: string;
  id?: string;
  status?: string;
  created_at?: string;
}

export interface DocumentReference {
  id: string;
  title: string;
  type: string;
  relevance: 'high' | 'medium' | 'low';
  content?: string;
  created_at?: string;
  updated_at?: string;
  visibility?: string;
  metadata?: any;
  associations?: any;
  url?: string;
}

export interface ChatOptions {
  modelId?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  property?: string;
  person?: string;
  createTask?: boolean;
}

export interface ChatCompletionRequest {
  messages: Message[];
  model: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  tools?: Tool[];
  tool_choice?: 'auto' | 'none' | ToolChoice;
}

export interface Tool {
  type: string;
  function: ToolFunction;
}

export interface ToolFunction {
  name: string;
  description: string;
  parameters: any;
}

export interface ToolChoice {
  type: string;
  function: {
    name: string;
  };
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatCompletionChoice {
  index: number;
  message: {
    role: string;
    content: string | null;
    tool_calls?: ToolCall[];
  };
  finish_reason: string;
}

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}
