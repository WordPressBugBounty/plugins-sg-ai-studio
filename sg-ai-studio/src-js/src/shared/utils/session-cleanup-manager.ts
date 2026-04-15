import { Store } from "@reduxjs/toolkit";
import { StoreRootState } from "../../store/types";
import { clearSession } from "../../store/slices/messages/messagesSlice";

export const SESSION_DURATION_MS = 60 * 60 * 1000;
export const CHECK_INTERVAL_MS = 60 * 1000;

let cleanupIntervalId: ReturnType<typeof setInterval> | null = null;

const shouldCleanupSession = (state: StoreRootState): boolean => {
  const { sessionStartTime } = state.messages;

  if (sessionStartTime === null) {
    return false;
  }

  const sessionAge = Date.now() - sessionStartTime;
  return sessionAge >= SESSION_DURATION_MS;
};

const checkAndCleanup = (store: Store<StoreRootState>): void => {
  const state = store.getState();

  if (shouldCleanupSession(state)) {
    const welcomeMsg = state.app.config.welcome_msg;
    const quickActions = state.app.config.quickActions;
    store.dispatch(clearSession({ welcomeMsg, quickActions }));
  }
};

export const startSessionCleanupManager = (store: Store<StoreRootState>): (() => void) => {
  checkAndCleanup(store);

  cleanupIntervalId = setInterval(() => {
    checkAndCleanup(store);
  }, CHECK_INTERVAL_MS);

  return () => {
    if (cleanupIntervalId !== null) {
      clearInterval(cleanupIntervalId);
      cleanupIntervalId = null;
    }
  };
};
