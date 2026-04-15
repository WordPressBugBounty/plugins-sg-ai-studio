import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatPosition } from "../../../chat/types/chat";
import { getDefaultChatPosition } from "../../../chat/utils/chat-position";

export interface ChatState {
  minimized: boolean;
  position: ChatPosition;
}

const initialState: ChatState = {
  minimized: false,
  position: getDefaultChatPosition(),
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMinimized: (state, action: PayloadAction<boolean>) => {
      state.minimized = action.payload;
    },
    setPosition: (state, action: PayloadAction<ChatPosition>) => {
      state.position = action.payload;
    },
    updatePosition: (state, action: PayloadAction<Partial<ChatPosition>>) => {
      state.position = { ...state.position, ...action.payload };
    },
  },
});

export const { setMinimized, setPosition, updatePosition } = chatSlice.actions;

export default chatSlice.reducer;
