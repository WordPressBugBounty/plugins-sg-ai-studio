import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WPAIStudioConfig } from "../../../shared/types/config";

export interface AppState {
  config: WPAIStudioConfig;
}

const initialState: AppState = {
  config: {
    home_url: "",
    admin_url: "",
    rest_base: "",
    assetsPath: "",
    localeSlug: "",
    locale: "",
    wp_nonce: "",
    welcome_msg: "",
    is_staging: false,
    quickActions: {
      categories: [],
      actionsTitle: "",
      actions: {},
    },
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    saveConfig: (state, action: PayloadAction<WPAIStudioConfig>) => {
      state.config = action.payload;
    },
  },
});

export const { saveConfig } = appSlice.actions;

export default appSlice.reducer;
