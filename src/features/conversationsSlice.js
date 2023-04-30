import { createSlice } from "@reduxjs/toolkit";

const conversationsSlice = createSlice({
  name: "conversations",
  initialState: [],
  reducers: {
    addConversation: (state, action) => {
      const conversationExists = state.some(
        (conversation) => conversation.id === action.payload.id
      );

      if (!conversationExists) {
        state.push({ ...action.payload, isActive: true });
      }

      state.forEach((conversation) => {
        conversation.isActive = conversation.id === action.payload.id;
      });
    },
    removeConversation: (state, action) => {
      return state.filter(
        (conversation) => conversation.id !== action.payload
      );
    },
  },
});

export const { addConversation, removeConversation } =
  conversationsSlice.actions;

export default conversationsSlice.reducer;