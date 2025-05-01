// src/redux/favoriteSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest, userRequest } from "../../requestMethods";

// Fetch user's favorite vendors
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("/favorites");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch favorites"
      );
    }
  }
);

// Toggle favorite status (add or remove)
export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (vendorId, { rejectWithValue, getState }) => {
    try {
      const { favorites } = getState();
      const isFavorite = favorites.items.some((item) => item._id === vendorId);

      if (isFavorite) {
        // Remove from favorites
        await userRequest.delete(`/favorites/${vendorId}`);
        return vendorId; // Return ID to remove from state
      } else {
        // Add to favorites
        const response = await userRequest.post("/favorites", { vendorId });
        return response.data; // Return the added vendor
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update favorite"
      );
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle favorite
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false;

        if (typeof action.payload === "string") {
          // This is a vendorId to remove
          state.items = state.items.filter(
            (item) => item._id !== action.payload
          );
        } else {
          // This is a vendor object to add
          state.items.push(action.payload);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default favoriteSlice.reducer;
