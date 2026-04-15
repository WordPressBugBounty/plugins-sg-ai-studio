import { createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import {
  addUserMessage,
  startAssistantMessage,
  completeStreamingMessage,
  setError,
  removeLastFailedMessage,
  setLastFailedRequest,
  clearLastFailedRequest,
} from "@/store/slices/messages/messagesSlice";
import { startChatStream } from "@/store/thunks/chat-stream";
import { ChatSubmitMessage, UserAction } from "@/chat/api/types";
import { getAiToken } from "@/shared/tokens/token";
import type { AppDispatch, RootState } from "@/store";

let activeAbortController: AbortController | null = null;
let isRetrying = false;

export const askQuestion = createAsyncThunk<
  void,
  {
    question: string | Array<ChatSubmitMessage>;
    threadId?: string;
    options?: {
      hiddenQuestion?: boolean;
      skipUserMessage?: boolean;
      trigger_action?: UserAction;
    };
  },
  { dispatch: AppDispatch; state: RootState }
>("chat/askQuestion", async ({ question, threadId, options }, { dispatch, getState }) => {
  const { hiddenQuestion = false, skipUserMessage = false, trigger_action } = options || {};

  const userMessageId = uuidv4();
  const questionText = typeof question === "string" ? question : JSON.stringify(question);

  dispatch(
    setLastFailedRequest({
      question,
      questionText,
      threadId,
      hiddenQuestion,
      skipUserMessage,
      trigger_action,
    })
  );

  if (!hiddenQuestion && !skipUserMessage) {
    dispatch(
      addUserMessage({
        id: userMessageId,
        content: questionText,
      })
    );
  }

  const assistantMessageId = `${userMessageId}-response`;

  dispatch(
    startAssistantMessage({
      id: assistantMessageId,
    })
  );

  activeAbortController = new AbortController();

  try {
    const token = await getAiToken().getToken();
    const isStaging = getState().app.config.is_staging;
    const baseUrl = isStaging ? "https://api.staging.studio.siteground.ai" : "https://api.studio.siteground.ai";

    await startChatStream({
      url: `${baseUrl}/chat/v1/wp-reply`,
      token,
      packet: {
        question,
        thread_id: threadId,
        agent: "wordpress_agent",
        trigger_action,
        service: 1,
      },
      messageId: assistantMessageId,
      dispatch,
      signal: activeAbortController.signal,
    });
  } catch (err: any) {
    if (err?.name !== "AbortError") dispatch(setError());
  } finally {
    activeAbortController = null;
  }
});

export const cancelReply = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "chat/cancelReply",
  (_, { dispatch, getState }) => {
    activeAbortController?.abort();
    activeAbortController = null;

    const messageId = getState().messages.activeStreamingMessageId;
    if (messageId) {
      dispatch(completeStreamingMessage({ messageId }));
    }

    dispatch(clearLastFailedRequest());
    isRetrying = false;
  }
);

export const retryLastFailedRequest = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "chat/retryLastFailedRequest",
  async (_, { dispatch, getState }) => {
    if (isRetrying) return;

    const { lastFailedRequest } = getState().messages;
    if (!lastFailedRequest) return;

    isRetrying = true;

    try {
      dispatch(removeLastFailedMessage());

      await dispatch(
        askQuestion({
          question: lastFailedRequest.question,
          threadId: lastFailedRequest.threadId,
          options: {
            hiddenQuestion: lastFailedRequest.hiddenQuestion,
            skipUserMessage: lastFailedRequest.skipUserMessage,
            trigger_action: lastFailedRequest.trigger_action,
          },
        })
      );
    } finally {
      isRetrying = false;
    }
  }
);
