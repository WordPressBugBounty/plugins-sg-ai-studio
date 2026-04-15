import BotMessage from "./bot-message/bot-message";
import ClientMessage from "./client-message/client-messages";
import "./styles.scss";
import { FC, useCallback, useMemo, useRef, useLayoutEffect, useState, useEffect } from "react";
import { Flex, Grid } from "@siteground/styleguide";
import { useScrollable } from "@/chat/hooks/use-scrollable";
import { StreamingMessage } from "@/store/slices/messages/messagesSlice";

interface Props {
  messages: StreamingMessage[];
  activeStreamingMessageId: string | null;
}

const ChatMessages: FC<Props> = ({ messages, activeStreamingMessageId }) => {
  const { visibleHeight, scrollToBottom } = useScrollable();
  const [lastUserMessageHeight, setLastUserMessageHeight] = useState(0);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);

  const lastUserMessage = useMemo(() => {
    return messages
      .slice()
      .reverse()
      .find((m) => m.role === "user");
  }, [messages]);

  useLayoutEffect(() => {
    if (lastUserMessageRef.current) {
      const height = lastUserMessageRef.current.offsetHeight;
      setLastUserMessageHeight(height);
    }
  }, [lastUserMessage?.id]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom("auto", false);
    }, 0);
  }, [scrollToBottom]);

  const heightOffset = lastUserMessageHeight + 40;

  const isLastMessage = useCallback(
    (id: string) => {
      return id === messages.at(-1)?.id;
    },
    [messages]
  );

  const hasPreviousResolvedAction = useCallback(
    (index: number) => {
      if (index === 0) return false;
      const prevMessage = messages[index - 1];
      return prevMessage?.role === "assistant" && prevMessage.actionRequest?.isResolved === true;
    },
    [messages]
  );

  const getMessageStyle = useCallback(
    (id: string, index: number) => {
      const isLast = isLastMessage(id);

      // If the previous message has a resolved action, don't apply minHeight to this message
      // This prevents the new streaming message from pushing the success notice upward
      if (hasPreviousResolvedAction(index)) {
        return { minHeight: "unset" };
      }

      // Apply scroll logic only to the last message
      return {
        minHeight: isLast ? `${visibleHeight - heightOffset}px` : "unset",
      };
    },
    [visibleHeight, heightOffset, isLastMessage, hasPreviousResolvedAction]
  );

  return (
    <Grid>
      {messages.map((message, index) => {
        if (message.role === "action_request") {
          return null;
        }

        return (
          <Flex direction="column" key={`message-${message.id}`} style={getMessageStyle(message.id, index)}>
            {message.role === "user" && (
              <div ref={lastUserMessage?.id === message.id ? lastUserMessageRef : null}>
                <ClientMessage key={`user-message-${message.id}`} message={message.content} />
              </div>
            )}

            {message.role === "assistant" && (
              <BotMessage
                key={`bot-message-${message.id}`}
                messageSegments={[{ type: "text", content: message.content }, { type: "quick-actions", content: message.quickActions }]}
                isTyping={message.isStreaming && message.id === activeStreamingMessageId}
                errorOccured={message.errorOccurred}
                actionRequest={message.actionRequest}
                messageId={message.id}
                showAvatar={false}
              />
            )}
          </Flex>
        );
      })}
    </Grid>
  );
};

export default ChatMessages;
