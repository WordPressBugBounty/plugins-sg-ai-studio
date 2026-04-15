import { createSlice } from "@reduxjs/toolkit";

const logoutSlice = createSlice({
  name: "logout",
  initialState: null,
  reducers: {
    logoutAndClearTokens: (state) => state,
  },
});

export const { logoutAndClearTokens } = logoutSlice.actions;

export default logoutSlice.reducer;
