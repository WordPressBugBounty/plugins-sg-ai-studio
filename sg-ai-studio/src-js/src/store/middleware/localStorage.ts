import { Middleware } from "@reduxjs/toolkit";
import { StoreRootState } from "../types";
import { getStorageKeys } from "../../shared/utils/local-storage";
import { updateSessionTimestamp } from "../slices/messages/messagesSlice";
import type { WPAIStudioConfig } from "@/shared/types/config";

const PERSISTED_KEYS: (keyof StoreRootState)[] = ["chat", "messages"];

const saveToLocalStorage = (state: StoreRootState, config: WPAIStudioConfig): void => {
  try {
    const stateToSave: Partial<StoreRootState> = {};

    PERSISTED_KEYS.forEach((key) => {
      if (state[key]) {
        (stateToSave as any)[key] = state[key];
      }
    });

    const keys = getStorageKeys(config);
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem(keys.CHAT_STATE, serializedState);
  } catch (error) {
    const keys = getStorageKeys(config);
    localStorage.removeItem(keys.CHAT_STATE);
  }
};

export const loadFromLocalStorage = (config: WPAIStudioConfig): Partial<StoreRootState> | undefined => {
  try {
    const keys = getStorageKeys(config);
    const serializedState = localStorage.getItem(keys.CHAT_STATE);

    if (!serializedState) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (error) {
    const keys = getStorageKeys(config);
    localStorage.removeItem(keys.CHAT_STATE);
    return undefined;
  }
};

export const clearLocalStorage = (config: WPAIStudioConfig): void => {
  try {
    const keys = getStorageKeys(config);
    localStorage.removeItem(keys.CHAT_STATE);
  } catch (error) {
    console.error("Failed to clear localStorage", { error });
  }
};

export const createLocalStorageMiddleware = (
  config: WPAIStudioConfig
): Middleware<Record<string, never>, StoreRootState> => {
  return (store) => (next) => (action: any) => {
    const result = next(action);

    const isRelevantAction = PERSISTED_KEYS.some((key) => action.type.toLowerCase().includes(key.toLowerCase()));

    if (isRelevantAction) {
      const state = store.getState();
      saveToLocalStorage(state, config);

      if (action.type.includes("messages/addUserMessage")) {
        store.dispatch(updateSessionTimestamp());
      }
    }

    return result;
  };
};
