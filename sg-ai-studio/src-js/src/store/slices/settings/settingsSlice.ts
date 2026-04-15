import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
  status: boolean;
  token: string | null;
  enablePowerAgent: boolean;
  activityLog: unknown;
}

const initialState: SettingsState = {
  status: false,
  token: null,
  enablePowerAgent: false,
  activityLog: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
});

export default settingsSlice.reducer;
