import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  array: [],
};

export const guestSlice = createSlice({
  name: "guests",
  initialState,
  reducers: {
    addCount: (state) => {
      state.value += 1;
    },
  },
});

export const { addCount } = guestSlice.actions;
export default guestSlice.reducer;
