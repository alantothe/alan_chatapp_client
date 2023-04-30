import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  pendingInvites: [],
  status: "idle",
};

export const fetchPendingInvites = createAsyncThunk("pendingInvites/fetchPendingInvites", async (userId) => {
  const response = await axios.get(`/api/user/${userId}/friend-requests`);
  return response.data;
});

export const pendingInvitesSlice = createSlice({
  name: "pendingInvites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingInvites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPendingInvites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pendingInvites = action.payload;
      })
      .addCase(fetchPendingInvites.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectPendingInvites = (state) => state.pendingInvites.pendingInvites;
export const selectPendingInvitesStatus = (state) => state.pendingInvites.status;

export default pendingInvitesSlice.reducer;
