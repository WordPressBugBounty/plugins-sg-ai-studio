import { getAiToken } from "@/shared/tokens/token";

export interface ChatMessage {
  chat_id: string;
  content: string;
  id: string;
  role: "assistant" | "user" | "system" | "tool_call" | "tool_result";
  sequence_number: number;
}

export interface FetchChatMessagesOptions {
  signal?: AbortSignal;
}

export const fetchChatMessages = async (
  chatId: string,
  options: FetchChatMessagesOptions = {}
): Promise<ChatMessage[]> => {
  const token = await getAiToken().getToken();

  const response = await fetch(`https://api.studio.siteground.ai/chat/v1/messages/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chat messages");
  }

  return response.json();
};
