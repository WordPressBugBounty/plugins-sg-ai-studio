import { ChatState } from './slices/chat/chatSlice';
import { SettingsState } from './slices/settings/settingsSlice';
import { MessagesState } from './slices/messages/messagesSlice';
import { AppState } from './slices/app/appSlice';

export interface StoreRootState {
  app: AppState;
  chat: ChatState;
  messages: MessagesState;
  settings: SettingsState;
}