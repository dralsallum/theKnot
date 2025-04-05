// redux/registrySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addedProducts: [],
  feedbackIcons: {}, // productId -> boolean that triggers a check mark
};

const registrySlice = createSlice({
  name: "registry",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const product = action.payload;
      // Only add if it doesn't already exist
      const exists = state.addedProducts.find((p) => p._id === product._id);
      if (!exists) {
        state.addedProducts.push(product);
      }
      // Show ephemeral feedback
      state.feedbackIcons[product._id] = true;
    },
    removeProduct: (state, action) => {
      const productId = action.payload;
      state.addedProducts = state.addedProducts.filter(
        (p) => p._id !== productId
      );
    },
    clearFeedbackIcon: (state, action) => {
      const productId = action.payload;
      delete state.feedbackIcons[productId];
    },
  },
});

export const { addProduct, removeProduct, clearFeedbackIcon } =
  registrySlice.actions;

export default registrySlice.reducer;
