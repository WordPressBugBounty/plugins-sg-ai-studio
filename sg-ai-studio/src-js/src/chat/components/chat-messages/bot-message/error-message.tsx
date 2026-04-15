import { Button, Flex, Notice, Text } from "@siteground/styleguide";
import { FC, useCallback, useState } from "react";
import { translate } from "i18n-calypso";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { retryLastFailedRequest } from "@/store/thunks/chat-thunks";

const ErrorMessage: FC = () => {
  const dispatch = useAppDispatch();
  const { lastFailedRequest, activeStreamingMessageId } = useAppSelector((state) => state.messages);
  const [isRetrying, setIsRetrying] = useState(false);

  const hasRetryable = lastFailedRequest !== null;
  const isCompleted = activeStreamingMessageId === null;

  const handleRetry = useCallback(async () => {
    if (!hasRetryable || !isCompleted) {
      return;
    }

    setIsRetrying(true);
    await dispatch(retryLastFailedRequest());
    setIsRetrying(false);
  }, [dispatch, hasRetryable, isCompleted]);

  const isDisabled = isRetrying || !hasRetryable || !isCompleted;

  return (
    <Notice type="error">
      <Flex align="center" justify="space-between" wrap="nowrap">
        <Text>{translate("A network error occurred. Please check your connection and try again.")}</Text>
        <Button type="ghost" onClick={handleRetry} disabled={isDisabled}>
          {translate("Retry")}
        </Button>
      </Flex>
    </Notice>
  );
};

export default ErrorMessage;
