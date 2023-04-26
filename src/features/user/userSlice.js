import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import axios from 'axios';

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/${userId}`);

      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const socket = io("http://localhost:4000", {
  autoConnect: false,
});




export const sendFriendRequest = createAsyncThunk(
  "user/sendFriendRequest",
  async ({ senderId, recipientEmail }, { dispatch }) => {
    try {
      const response = await axios.post("http://localhost:4000/api/user/send-friend-request", {
        senderId,
        recipientEmail,
      });

      const data = response.data;

      // Emit the "send_friend_request" event after a successful friend request
      socket.emit("send_friend_request", { senderId, recipientEmail });

      // Return the sender's information
      return data;

    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the friend request.");
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "user/acceptFriendRequest",
  async (senderId, { dispatch, getState }) => {
    try {
      const { id } = getState().user.data;
      const response = await axios.post("http://localhost:4000/api/user/accept-friend-request", {
        senderId,
        receiverId: id,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      alert("An error occurred while accepting the friend request.");
    }
  }
);


export const rejectFriendRequest = createAsyncThunk(
  "user/rejectFriendRequest",
  async (senderId, { dispatch, getState }) => {
    try {
      const { id } = getState().user.data;
      const response = await axios.post("http://localhost:4000/api/user/reject-friend-request", {
        senderId,
        receiverId: id,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      alert("An error occurred while rejecting the friend request.");
    }
  }
);







const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
    selectedFriend: null,
  },
  reducers: {
    updateUser(state, action) {
      state.data = action.payload;
    },
    setSelectedFriend(state, action) {
      state.selectedFriend = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(sendFriendRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.status = 'failed';
        console.error(action.error.message);
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const senderId = action.meta.arg;
        state.data.friendRequests = state.data.friendRequests.filter(
          (request) => request.id !== senderId
        );
        state.data.friends.push(action.payload);
      })
  },
});

// Define and export the selectUser selector
export const selectUser = createSelector(
  (state) => state.user,
  (user) => user.data
);

export const selectSelectedFriend = createSelector(
  (state) => state.user,
  (user) => user.selectedFriend
);


// Export the updateUser action

export const { updateUser, setSelectedFriend } = userSlice.actions;


export default userSlice.reducer;
