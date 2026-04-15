import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReceivePacket, TextDelta, UserActionRequest, ChatSubmitMessage, UserAction } from "../../../chat/api/types";
import { saveConfig } from "../app/appSlice";

import { QuickActions } from "@/shared/types/config";

export interface LastFailedRequest {
  question: string | Array<ChatSubmitMessage>;
  questionText: string;
  threadId?: string;
  hiddenQuestion?: boolean;
  skipUserMessage?: boolean;
  trigger_action?: UserAction;
}

export interface BaseMessage {
  id: string;
  timestamp: number;
}

export interface UserMessage extends BaseMessage {
  role: "user";
  content: string;
}

export interface AssistantMessage extends BaseMessage {
  role: "assistant";
  content: string;
  isStreaming: boolean;
  isComplete: boolean;
  errorOccurred?: boolean;
  needsNewlineBeforeNextDelta?: boolean;
  actionRequest?: {
    actionRequired: "super_power";
    toolCall: {
      id: string;
      name: string;
      args: unknown;
    };
    isResolved?: boolean;
  };
  quickActions?: QuickActions;
}

export interface ActionRequestMessage extends BaseMessage {
  role: "action_request";
  actionRequired: "super_power";
  toolCall: {
    id: string;
    name: string;
    args: unknown;
  };
  isResolved?: boolean;
}

export type StreamingMessage = UserMessage | AssistantMessage | ActionRequestMessage;

export interface MessagesState {
  threadId: string | null;
  messages: StreamingMessage[];
  activeStreamingMessageId: string | null;
  phase: "initial" | "loading" | "chat-active" | "error";
  sessionStartTime: number | null;
  lastFailedRequest: LastFailedRequest | null;
}

const initialState: MessagesState = {
  threadId: null,
  messages: [],
  activeStreamingMessageId: null,
  phase: "initial",
  sessionStartTime: null,
  lastFailedRequest: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    startNewConversation: (state, action: PayloadAction<{ welcomeMsg: string; quickActions: QuickActions }>) => {
      state.threadId = null;
      state.messages = [
        {
          id: "initial-welcome-message",
          role: "assistant",
          content: action.payload.welcomeMsg,
          timestamp: Date.now(),
          isStreaming: false,
          isComplete: true,
          quickActions: action.payload.quickActions,
        },
      ];
      state.activeStreamingMessageId = null;
      state.phase = "initial";
      state.lastFailedRequest = null;
    },

    setThreadId: (state, action: PayloadAction<string>) => {
      state.threadId = action.payload;
      state.phase = "chat-active";
    },

    addUserMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const { id, content } = action.payload;
      state.messages.push({
        id,
        role: "user",
        content,
        timestamp: Date.now(),
      });
      state.phase = "chat-active";
    },

    startAssistantMessage: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.messages.push({
        id,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
        isComplete: false,
      });
      state.activeStreamingMessageId = id;
    },

    appendToStreamingMessage: (state, action: PayloadAction<{ messageId: string; text: string }>) => {
      const { messageId, text } = action.payload;
      const message = state.messages.find((m) => m.id === messageId && m.role === "assistant") as
        | AssistantMessage
        | undefined;
      if (message && message.isStreaming) {
        message.content += text;
      }
    },

    completeStreamingMessage: (state, action: PayloadAction<{ messageId: string }>) => {
      const { messageId } = action.payload;
      const message = state.messages.find((m) => m.id === messageId && m.role === "assistant") as
        | AssistantMessage
        | undefined;
      if (message) {
        message.isStreaming = false;
        message.isComplete = true;
      }
      if (state.activeStreamingMessageId === messageId) {
        state.activeStreamingMessageId = null;
      }
    },

    addActionRequestMessage: (state, action: PayloadAction<{ packet: UserActionRequest }>) => {
      const { packet } = action.payload;
      state.messages.push({
        id: packet.message_id,
        role: "action_request",
        actionRequired: packet.action_required.user_action_required,
        toolCall: packet.tool_call,
        timestamp: Date.now(),
        isResolved: false,
      });
    },

    resolveActionRequest: (state, action: PayloadAction<{ messageId: string }>) => {
      const { messageId } = action.payload;
      const message = state.messages.find((m) => m.id === messageId && m.role === "assistant") as
        | AssistantMessage
        | undefined;
      if (message?.actionRequest) {
        message.actionRequest.isResolved = true;
      }
    },

    processStreamingPacket: (state, action: PayloadAction<{ messageId: string; packet: ReceivePacket }>) => {
      const { messageId, packet } = action.payload;

      switch (packet.type) {
        case "text_delta": {
          const message = state.messages.find((m) => m.id === messageId && m.role === "assistant") as
            | AssistantMessage
            | undefined;
          if (message && message.isStreaming) {
            if (message.needsNewlineBeforeNextDelta && message.content.length > 0) {
              message.content += "\n\n---\n\n";
              message.needsNewlineBeforeNextDelta = false;
            }
            message.content += (packet as TextDelta).content;
          }
          break;
        }
        case "user_action_request": {
          const actionPacket = packet as UserActionRequest;
          const message = state.messages.find((m) => m.id === messageId && m.role === "assistant") as
            | AssistantMessage
            | undefined;
          if (message) {
            message.actionRequest = {
              actionRequired: actionPacket.action_required.user_action_required,
              toolCall: actionPacket.tool_call,
              isResolved: false,
            };
          }
          break;
        }
        case "assistant_message_complete": {
          const message = state.messages.find((m) => m.id === messageId && m.role === "assistant") as
            | AssistantMessage
            | undefined;
          if (message) {
            message.needsNewlineBeforeNextDelta = true;
          }
          break;
        }
      }
    },

    loadMessages: (state, action: PayloadAction<{ threadId: string; messages: StreamingMessage[] }>) => {
      const { threadId, messages } = action.payload;
      state.threadId = threadId;
      state.messages = messages;
      state.activeStreamingMessageId = null;
      state.phase = "chat-active";
    },

    setError: (state) => {
      state.phase = "error";
      if (state.activeStreamingMessageId) {
        const message = state.messages.find(
          (m) => m.id === state.activeStreamingMessageId && m.role === "assistant"
        ) as AssistantMessage | undefined;
        if (message) {
          message.isStreaming = false;
          message.isComplete = true;
          message.errorOccurred = true;
        }
        state.activeStreamingMessageId = null;
      }
    },

    removeLastFailedMessage: (state) => {
      if (state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage.role === "assistant" && (lastMessage as AssistantMessage).errorOccurred) {
          state.messages.pop();
          const userMessage = state.messages[state.messages.length - 1];
          if (userMessage?.role === "user") {
            state.messages.pop();
          }
        }
      }
    },

    updateSessionTimestamp: (state) => {
      state.sessionStartTime = Date.now();
    },

    clearSession: (state, action: PayloadAction<{ welcomeMsg?: string; quickActions?: QuickActions } | undefined>) => {
      state.threadId = null;
      state.messages = [];
      state.activeStreamingMessageId = null;
      state.phase = "initial";
      state.sessionStartTime = null;
      state.lastFailedRequest = null;

      if (action.payload?.welcomeMsg) {
        state.messages.push({
          id: "initial-welcome-message",
          role: "assistant",
          content: action.payload.welcomeMsg,
          timestamp: Date.now(),
          isStreaming: false,
          isComplete: true,
          quickActions: action.payload.quickActions,
        });
      }
    },

    setLastFailedRequest: (state, action: PayloadAction<LastFailedRequest>) => {
      state.lastFailedRequest = action.payload;
    },

    clearLastFailedRequest: (state) => {
      state.lastFailedRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveConfig, (state, action) => {
      if (state.messages.length === 0 && action.payload.welcome_msg) {
        state.messages.push({
          id: "initial-welcome-message",
          role: "assistant",
          content: action.payload.welcome_msg,
          timestamp: Date.now(),
          isStreaming: false,
          isComplete: true,
          quickActions: action.payload.quickActions,
        });
      }
    });
  },
});

export const {
  startNewConversation,
  setThreadId,
  addUserMessage,
  startAssistantMessage,
  appendToStreamingMessage,
  completeStreamingMessage,
  addActionRequestMessage,
  resolveActionRequest,
  processStreamingPacket,
  loadMessages,
  setError,
  removeLastFailedMessage,
  updateSessionTimestamp,
  clearSession,
  setLastFailedRequest,
  clearLastFailedRequest,
} = messagesSlice.actions;

export default messagesSlice.reducer;
