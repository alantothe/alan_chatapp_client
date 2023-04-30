import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch friends' data for a given user ID
export const fetchFriendsByUserId = createAsyncThunk(
  'friends/fetchFriendsByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/${userId}/friends`);

      if (!response.ok) {
        throw new Error(`Error fetching friends: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const friendsSlice = createSlice({
  name: 'friends',
  initialState: {
    friendsList: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendsByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFriendsByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.friendsList = action.payload;
      })
      .addCase(fetchFriendsByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default friendsSlice.reducer;

// Selector to get the friends' data from the state
export const selectFriends = (state) => state.friends.friendsList;
