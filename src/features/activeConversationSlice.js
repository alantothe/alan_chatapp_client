import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeConversation: null,
};

export const activeConversationSlice = createSlice({
  name: "activeConversation",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
  },
});

export const { setActiveConversation } = activeConversationSlice.actions;

export const selectActiveConversation = (state) =>
  state.activeConversation.activeConversation;

export default activeConversationSlice.reducer;
