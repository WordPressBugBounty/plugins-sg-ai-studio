export type DefaultToolResultContent = {
  id: string;
  name: "";
  response: {
    output: {
      status: "success" | "error";
      result: string;
    };
    error?: null | string;
  };
};

export type Result = {
  link: string;
  snippet: string;
  title: string;
  siteName: string;
};

export type GoogleSearchToolResultContent = {
  id: string;
  name: "google_search";
  response: {
    error: null;
    output: {
      query: string;
      results: Result[];
    };
  };
};

export type ImageGeneratorContent = {
  id: string;
  name: "image_generation";
};

export type ImageEditingContent = {
  id: string;
  name: "image_editing";
};

export interface ChatSubmitMessage {
  type: "text" | "image_url" | "file_url";
  text?: string;
  image_url?: {
    url: string;
  };
  file_url?: {
    url: string;
    file_name: string;
    file_size: number;
    mime_type: string;
  };
}

export type BaseStreamPacket = {
  chat_id: string;
  message_id: string;
};

export type RegisteredUserMessage = BaseStreamPacket & {
  type: "registered_user_message";
};

export type TextDelta = BaseStreamPacket & {
  type: "text_delta";
  content: string;
};

export type AssistantMessageComplete = BaseStreamPacket & {
  type: "assistant_message_complete";
};

export type ToolCall = BaseStreamPacket & {
  type: "tool_call";
  content: {
    id: string;
    name: string;
    args: Record<string, any>;
  } | null;
};

export type ToolResult = BaseStreamPacket & {
  type: "tool_result";
  content:
    | DefaultToolResultContent
    | GoogleSearchToolResultContent
    | ImageGeneratorContent
    | ImageEditingContent
    | null;
};

export type UserActionRequest = BaseStreamPacket & {
  type: "user_action_request";
  action_required: {
    user_action_required: "super_power";
    metadata: {
      provider: string;
    };
  };
  tool_call: {
    id: string;
    name: string;
    args: unknown;
  };
};

export interface FinishPacket {
  type: "finished";
}

export interface ErrorPacket {
  type: "error";
  error: string;
}

export type ReceivePacket =
  | RegisteredUserMessage
  | TextDelta
  | AssistantMessageComplete
  | ToolCall
  | ToolResult
  | UserActionRequest
  | FinishPacket
  | ErrorPacket;

export interface UserAction {
  action_type: string;
  tool_calls: {
    id: string;
    name: string;
  }[];
}

export interface SendPacket {
  question: string | Array<ChatSubmitMessage>;
  thread_id?: string;
  model?: string;
  agent?: string;
  trigger_action?: UserAction;
  service?: number;
}

export type ActionMenuOption = "agents" | "prompts";

export type ActionMenu = {
  label: ActionMenuOption;
  icon: string;
};
