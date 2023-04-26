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
        state.push(action.payload);
      }
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
