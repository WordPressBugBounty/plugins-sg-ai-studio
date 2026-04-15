import { CHAT_WIDTH, CHAT_HEIGHT } from "../constants/chat";
import { ChatPosition } from "../types/chat";

export const getDefaultChatPosition = (): ChatPosition => {
  const margin = 20;
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
  const screenHeight = window.innerHeight || document.documentElement.clientHeight || 768;

  const topPos = screenHeight - CHAT_HEIGHT - margin > 32 ? screenHeight - CHAT_HEIGHT - margin : 32;

  return {
    left: Math.max(0, screenWidth - CHAT_WIDTH - margin),
    top: Math.max(0, topPos),
    width: CHAT_WIDTH,
    height: CHAT_HEIGHT,
  };
};
