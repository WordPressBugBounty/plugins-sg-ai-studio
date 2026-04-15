import { Icon, Tooltip } from "@siteground/styleguide";
import { useChatState } from "@/store/hooks/useChatState";
import { translate } from "i18n-calypso";

const ChatMinimized = () => {
  const { setMinimized } = useChatState();

  return (
    <Tooltip content={translate("Open chat")}>
      <div className="chat-close-state" onClick={() => setMinimized(false)}>
        <Icon name="ai-tools/ai-chat" size="24" color="white" />
      </div>
    </Tooltip>
  );
};

export default ChatMinimized;
