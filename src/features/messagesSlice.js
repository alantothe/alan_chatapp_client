import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ senderId, receiverId, content }, { dispatch }) => {
    try {
      const response = await axios.post("http://localhost:4000/api/messages", {
        senderId,
        receiverId,
        content,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the message.");
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ senderId, receiverId }, { dispatch }) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/messages/${receiverId}/${senderId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching the messages.");
    }
  }
);


const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        console.error(action.error.message);
      })
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        console.error(action.error.message);
      });
  },
});

export const { addMessage, clearMessages } = messageSlice.actions;

export const selectMessages = (state) => state.messages.messages;

export default messageSlice.reducer;
