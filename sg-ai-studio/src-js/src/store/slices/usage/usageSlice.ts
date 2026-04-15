import { wp_api } from "@/store/api/wp-api";
import { createSlice } from "@reduxjs/toolkit";

export interface UsageState {
  balance: number | null;
  budget: number | null;
  source: Record<string, number> | null;
}

const initialState: UsageState = {
  balance: null,
  budget: null,
  source: null,
};

const usageSlice = createSlice({
  name: "usage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(wp_api.endpoints.getUsage.matchFulfilled, (state, action) => {
      state.balance = action.payload.balance;
      state.budget = action.payload.budget;
      state.source = action.payload.source;
    });
  },
});

export default usageSlice.reducer;
