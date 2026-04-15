import Avatar from "@siteground/styleguide/lib/components/avatar/avatar";
import cn from "@siteground/styleguide/lib/utils/classnames";
import { Flex } from "@siteground/styleguide";
import { FC, useRef } from "react";
import { MarkdownParser } from "../../markdown-parser/mardown-parser";
import { useAppSelector } from "@/store/hooks";
import { MessageSegment } from "@/chat/types/message-segments";
import TypingIndicator from "../typing-indicator/typing-indicator";
import { PowerModeNotice } from "../power-mode-notice/power-mode-notice";
import ErrorMessage from "./error-message";
import QuickActions from "../quick-actions/quick-actions";

interface Props {
  messageSegments: MessageSegment[];
  isTyping: boolean;
  errorOccured: boolean;
  showAvatar?: boolean;
  actionRequest?: {
    actionRequired: "super_power";
    toolCall: {
      id: string;
      name: string;
      args: unknown;
    };
    isResolved?: boolean;
  };
  messageId?: string;
}

const BotMessage: FC<Props> = ({ messageSegments, isTyping, errorOccured, showAvatar, actionRequest, messageId }) => {
  const domRef = useRef(null);
  const config = useAppSelector((state) => state.app.config);
  const { threadId } = useAppSelector((state) => state.messages);

  const avatarIcon = config.assetsPath + "/images/wp-agent-logo.png";

  const classes = cn("wp-ai-studio-bot-message", "wp-ai-studio-message-vertical-align-bot");

  return (
    <div ref={domRef} className={classes}>
      {showAvatar && (
        <div className="wp-ai-studio-bot-message__avatar">
          <Avatar src={avatarIcon} alt="Wordpress Agent" size="40" />
        </div>
      )}

      {messageSegments.map((segment, index) => {
        if (segment.type === "text") {
          return (
            <div className="sg-markdown-container" key={`bot-message-${index}`}>
              <MarkdownParser>{segment.content}</MarkdownParser>
            </div>
          );
        }

        if (segment.type === "quick-actions" && segment.content?.categories && !threadId) {
          return (
            <Flex key="bot-message-actions" padding={["medium", "none", "none"]}>
              <QuickActions
                categories={segment.content?.categories}
                actionsTitle={segment.content?.actionsTitle}
                actions={segment.content?.actions}
              />
            </Flex>
          );
        }
        return null;
      })}

      {isTyping && <TypingIndicator />}

      {errorOccured && <ErrorMessage />}

      {actionRequest && actionRequest.actionRequired === "super_power" && messageId && (
        <PowerModeNotice
          messageId={messageId}
          toolCall={actionRequest.toolCall}
          isResolved={actionRequest.isResolved}
        />
      )}
    </div>
  );
};

export default BotMessage;
