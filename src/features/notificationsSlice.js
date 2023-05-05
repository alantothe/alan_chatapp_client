import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    count: 0,
  },
  reducers: {
    incrementNotification: (state) => {
      state.count++;
    },
    resetNotification: (state) => {
      state.count = 0;
    },
  },
});

export const { incrementNotification, resetNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
