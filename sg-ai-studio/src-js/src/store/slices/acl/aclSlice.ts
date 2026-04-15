import { ACLFeatures, wp_api } from "@/store/api/wp-api";
import { createSlice } from "@reduxjs/toolkit";

export interface ACLState {
  features: ACLFeatures | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ACLState = {
  features: null,
  isLoading: false,
  error: null,
};

const aclSlice = createSlice({
  name: "acl",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(wp_api.endpoints.getACL.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(wp_api.endpoints.getACL.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.features = action.payload.features;
      })
      .addMatcher(wp_api.endpoints.getACL.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default aclSlice.reducer;
