import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setMinimized, setPosition, updatePosition } from "../slices/chat/chatSlice";
import { ChatPosition } from "../../chat/types/chat";
import { setThreadId } from "../slices/messages/messagesSlice";

export const useChatState = () => {
  const dispatch = useAppDispatch();

  const { minimized, position } = useAppSelector((state) => state.chat);
  const [threadId] = useAppSelector((state) => [state.messages.threadId]);

  const handleSetThreadId = useCallback(
    (id: string | null) => {
      dispatch(setThreadId(id));
    },
    [dispatch]
  );

  const handleSetMinimized = useCallback(
    (isMinimized: boolean) => {
      dispatch(setMinimized(isMinimized));
    },
    [dispatch]
  );

  const handleSetPosition = useCallback(
    (newPosition: ChatPosition) => {
      dispatch(setPosition(newPosition));
    },
    [dispatch]
  );

  const handleUpdatePosition = useCallback(
    (updates: Partial<ChatPosition>) => {
      dispatch(updatePosition(updates));
    },
    [dispatch]
  );

  const handleResetChatPosition = useCallback(
    (domRef: HTMLDivElement, width: number, height: number) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const newLeft = Math.max(0, screenWidth - width - 30);
      const newTop = Math.max(0, screenHeight - height - 30);

      dispatch(
        updatePosition({
          width,
          height,
          left: newLeft,
          top: newTop,
        })
      );

      domRef.style.width = `${width}px`;
      domRef.style.height = `${height}px`;
      domRef.style.left = `${newLeft}px`;
      domRef.style.top = `${newTop}px`;
    },
    [dispatch]
  );

  return {
    // State
    threadId,
    minimized,
    position,

    // Actions
    setThreadId: handleSetThreadId,
    setMinimized: handleSetMinimized,
    setPosition: handleSetPosition,
    updatePosition: handleUpdatePosition,
    resetChatPosition: handleResetChatPosition,
  };
};
