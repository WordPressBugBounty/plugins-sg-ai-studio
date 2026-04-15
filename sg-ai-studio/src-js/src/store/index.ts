import { configureStore, combineReducers } from "@reduxjs/toolkit";
import chatReducer from "./slices/chat/chatSlice";
import messagesReducer from "./slices/messages/messagesSlice";
import settingsReducer from "./slices/settings/settingsSlice";
import appReducer from "./slices/app/appSlice";
import logoutReducer from "./slices/logout";
import filesReducer from "./slices/files/filesSlice";
import usageReducer from "./slices/usage/usageSlice";
import aclReducer from "./slices/acl/aclSlice";
import { createLocalStorageMiddleware, loadFromLocalStorage } from "./middleware/localStorage";
import { ai_api } from "./api/ai-api";
import { wp_api } from "./api/wp-api";
import { invalidateLocalStorage } from "@siteground/styleguide/lib";
import { getStorageKeys } from "../shared/utils/local-storage";
import type { WPAIStudioConfig } from "@/shared/types/config";

const rootReducer = combineReducers({
  app: appReducer,
  chat: chatReducer,
  messages: messagesReducer,
  settings: settingsReducer,
  files: filesReducer,
  logout: logoutReducer,
  usage: usageReducer,
  acl: aclReducer,
  [ai_api.reducerPath]: ai_api.reducer,
  [wp_api.reducerPath]: wp_api.reducer,
});

let storeInstance: ReturnType<typeof configureStore<ReturnType<typeof rootReducer>>> | null = null;

export const initializeStore = (config: WPAIStudioConfig) => {
  if (storeInstance) {
    return storeInstance;
  }

  const keys = getStorageKeys(config);

  invalidateLocalStorage(
    {
      [keys.CHAT_STATE]: 2,
    },
    keys.INVALIDATION
  );

  const preloadedState = loadFromLocalStorage(config);

  storeInstance = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(createLocalStorageMiddleware(config) as any, ai_api.middleware, wp_api.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  return storeInstance;
};

export const getStore = () => {
  if (!storeInstance) {
    throw new Error("Store not initialized. Call initializeStore(config) first.");
  }
  return storeInstance;
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof initializeStore>["dispatch"];
