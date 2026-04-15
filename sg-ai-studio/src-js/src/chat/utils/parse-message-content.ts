import { ChatSubmitMessage } from "@/chat/api/types";

export interface ParsedMessageContent {
  textItems: ChatSubmitMessage[];
  imageItems: ChatSubmitMessage[];
  fileItems: ChatSubmitMessage[];
}

export const parseMessageContent = (message: string): ParsedMessageContent | null => {
  try {
    if (message.startsWith("[") && message.includes('"type"')) {
      const contentArray = JSON.parse(message) as ChatSubmitMessage[];

      const textItems = contentArray.filter((item) => item.type === "text");
      const imageItems = contentArray.filter((item) => item.type === "image_url");
      const fileItems = contentArray.filter((item) => item.type === "file_url");

      return {
        textItems,
        imageItems,
        fileItems,
      };
    }
    return null;
  } catch {
    return null;
  }
};
