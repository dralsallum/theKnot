// FIXED REDUX SLICE (cartSlice.js)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  total: 0,
  quantity: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const productToAdd = action.payload;
      const existingProductIndex = state.products.findIndex(
        (p) => p._id === productToAdd._id
      );

      if (existingProductIndex >= 0) {
        state.products[existingProductIndex].quantity += productToAdd.quantity;
        // Fix: Update total correctly
        state.total += productToAdd.price * productToAdd.quantity;
      } else {
        state.quantity += 1;
        state.products.push(productToAdd);
        // Fix: Add to total, don't replace it
        state.total += productToAdd.price * productToAdd.quantity;
      }
    },

    // FIXED removeFromCart - expects just the product ID (string)
    removeFromCart: (state, action) => {
      const productIdToRemove = action.payload; // This should be just the ID string
      const productToRemove = state.products.find(
        (p) => p._id === productIdToRemove
      );

      if (productToRemove) {
        state.quantity -= 1;
        state.total -= productToRemove.price * productToRemove.quantity;
        state.products = state.products.filter(
          (p) => p._id !== productIdToRemove // Fix: Use the ID, not the object
        );
      }
    },

    clearCart: (state) => {
      state.products = [];
      state.total = 0;
      state.quantity = 0;
      state.loading = false;
      state.error = null;
    },

    paymentStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    paymentSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },

    paymentFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const {
  addToCart,
  clearCart,
  paymentStart,
  paymentSuccess,
  paymentFailure,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
