import type { WPAIStudioConfig } from "@/shared/types/config";

const hashString = (str: string): string => {
  let hash = 2169136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16).substring(0, 8);
};

export const generateStorageKey = (config: WPAIStudioConfig, keyName: string): string => {
  const pathHash = hashString(config.home_url);
  return `${pathHash}_wp_ai_studio_${keyName}`;
};

export const getStorageKeys = (config: WPAIStudioConfig) => ({
  CHAT_STATE: generateStorageKey(config, "chat_state"),
  TOKEN: generateStorageKey(config, "token"),
  INVALIDATION: generateStorageKey(config, "invalidation"),
});

export const clearChatState = (config: WPAIStudioConfig): void => {
  try {
    const keys = getStorageKeys(config);
    localStorage.removeItem(keys.CHAT_STATE);
  } catch (error) {
    console.error("Failed to clear chat state from localStorage", { error });
  }
};

export const clearToken = (config: WPAIStudioConfig): void => {
  try {
    const keys = getStorageKeys(config);
    localStorage.removeItem(keys.TOKEN);
  } catch (error) {
    console.error("Failed to clear token from localStorage", { error });
  }
};

export const clearAllAppData = (config: WPAIStudioConfig): void => {
  clearChatState(config);
  clearToken(config);
};

export const hasChatState = (config: WPAIStudioConfig): boolean => {
  try {
    const keys = getStorageKeys(config);
    return localStorage.getItem(keys.CHAT_STATE) !== null;
  } catch {
    return false;
  }
};

export const hasToken = (config: WPAIStudioConfig): boolean => {
  try {
    const keys = getStorageKeys(config);
    return localStorage.getItem(keys.TOKEN) !== null;
  } catch {
    return false;
  }
};

const LEGACY_KEYS = ["wp_ai_studio_chat_state", "wp_ai_studio_token", "wp_ai_studio_invalidation"];

export const cleanupLegacyLocalStorage = (): void => {
  try {
    LEGACY_KEYS.forEach((key) => {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Failed to cleanup legacy localStorage keys", { error });
  }
};
