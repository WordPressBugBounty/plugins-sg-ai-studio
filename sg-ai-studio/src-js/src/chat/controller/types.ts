export interface ChatControllerEvents {
  ReplyCompleted: { chatId: string };
  ChatLoadError: never;
  NewChatStarted: never;
  ChatRestored: { threadId: string; messageCount: number };
}

export interface ChatModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  is_default: boolean;
  type_name: string;
}

export interface ChatControllerContext {
  agentName?: string;
  agentDescription?: string;
  initialPrompt?: string;
  modelId?: ChatModel["id"];
}

export type ErrorFirstCallback<T> = (error: Error | null, result?: T) => void;
