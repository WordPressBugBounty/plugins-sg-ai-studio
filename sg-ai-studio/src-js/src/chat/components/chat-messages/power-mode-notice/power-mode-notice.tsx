import { FC, useCallback, useState } from "react";
import { Button } from "@siteground/styleguide";
import SystemMessage from "../system-message/system-message";
import { usePowermode } from "@/settings/hooks/use-powermode";
import { askQuestion } from "@/store/thunks/chat-thunks";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { resolveActionRequest } from "@/store/slices/messages/messagesSlice";
import { translate } from "i18n-calypso";
import { broadcast } from "@/shared/utils/event-broadcast";

interface Props {
  messageId: string;
  toolCall: {
    id: string;
    name: string;
    args: unknown;
  };
  isResolved?: boolean;
}

export const PowerModeNotice: FC<Props> = ({ messageId, isResolved = false }) => {
  const dispatch = useAppDispatch();
  const { isPowerModeLoading, handlePowerModeToggle } = usePowermode();
  const { threadId } = useAppSelector((state) => state.messages);
  const [hasTriggeredRetry, setHasTriggeredRetry] = useState(isResolved);

  const handleEnablePowerMode = useCallback(async () => {
    await handlePowerModeToggle(true);

    broadcast("powermode_changed", { enabled: true });

    dispatch(
      askQuestion({
        question: "The user has successfully enabled Power Mode. Retry the last command.",
        threadId: threadId || undefined,
        options: {
          hiddenQuestion: true,
          trigger_action: { action_type: "retry", tool_calls: [] },
        },
      })
    );

    setHasTriggeredRetry(true);
    dispatch(resolveActionRequest({ messageId }));
  }, [handlePowerModeToggle, threadId, messageId, dispatch]);

  if (hasTriggeredRetry) {
    return (
      <SystemMessage
        type="success"
        message={translate(
          "Power Mode is on. Note: Power Mode may modify your site’s content or settings. Tap Learn more for details before proceeding."
        )}
      >
        <Button
          color="secondary"
          action="button"
          onClick={() => window.open("https://www.siteground.com/kb/power-mode-ai-agent-wordpress", "_blank")}
        >
          {translate("Learn more")}
        </Button>
      </SystemMessage>
    );
  }

  return (
    <SystemMessage
      type="warning"
      message={translate(
        "Enable Power Mode to continue. Note: Power Mode may modify your site’s content or settings. Tap Learn more for details before enabling."
      )}
    >
      <Button
        color="secondary"
        onClick={() => window.open("https://www.siteground.com/kb/power-mode-ai-agent-wordpress", "_blank")}
      >
        {translate("Learn more")}
      </Button>
      <Button color="primary" onClick={handleEnablePowerMode} disabled={isPowerModeLoading}>
        {translate("Enable")}
      </Button>
    </SystemMessage>
  );
};
