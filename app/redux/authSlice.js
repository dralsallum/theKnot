import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchAds } from "./adsSlice";
import * as SecureStore from "expo-secure-store";

// --- Define Base URL ---
const BASE_URL = "https://theknot-30278e2ff419.herokuapp.com/api";

// --- Helper to get authenticated config ---
const getAuthConfig = (getState) => {
  const token = getState().user.currentUser?.accessToken;
  if (!token) {
    console.warn("Attempted authenticated request without token.");
    return { headers: {} };
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- Thunk: Upload User Profile Image ---
export const uploadUserProfileImage = createAsyncThunk(
  "user/uploadUserProfileImage",
  async ({ userId, imageAsset }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      if (!config.headers.Authorization)
        return rejectWithValue("User not authenticated");

      const formData = new FormData();
      formData.append("profileImage", {
        uri: imageAsset.uri,
        name: imageAsset.fileName || `photo.${imageAsset.type?.split("/")[1]}`,
        type: imageAsset.type || "image/jpeg",
      });

      const response = await axios.post(
        `${BASE_URL}/users/${userId}/upload-profile-image`,
        formData,
        {
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// --- Thunk: Update User Profile ---
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, updates }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      if (!config.headers.Authorization)
        return rejectWithValue("User not authenticated");

      const response = await axios.put(
        `${BASE_URL}/users/profile/${userId}`,
        updates,
        config
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// --- Thunk: Delete User ---
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ userId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      if (!config.headers.Authorization)
        return rejectWithValue("User not authenticated");

      await axios.delete(`${BASE_URL}/users/${userId}`, config);
      dispatch(signOut());
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// --- Thunk: Fetch Saved Vendors ---
export const fetchSavedVendors = createAsyncThunk(
  "user/fetchSavedVendors",
  async (userId, { getState, rejectWithValue }) => {
    if (!userId) return rejectWithValue("No user ID provided");
    try {
      const config = getAuthConfig(getState);
      if (!config.headers.Authorization)
        return rejectWithValue("User not authenticated");

      const response = await axios.get(
        `${BASE_URL}/users/${userId}/saved-vendors`,
        config
      );
      return {
        savedVendorIds: response.data.savedVendors,
        savedCount: response.data.savedCount,
      };
    } catch (error) {
      console.error(
        "Error fetching saved vendors:",
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message || "Failed to fetch saved vendors";
      return rejectWithValue(message);
    }
  }
);

// --- Thunk: Toggle Save Vendor ---
export const toggleSaveVendor = createAsyncThunk(
  "user/toggleSaveVendor",
  async ({ userId, vendorId }, { getState, rejectWithValue }) => {
    if (!userId) return rejectWithValue("User not logged in");
    if (!vendorId) return rejectWithValue("Vendor ID is required");
    try {
      const config = getAuthConfig(getState);
      if (!config.headers.Authorization)
        return rejectWithValue("User not authenticated");

      const response = await axios.put(
        `${BASE_URL}/users/${userId}/save-vendor`,
        { vendorId },
        config
      );
      return {
        savedVendorIds: response.data.savedVendors,
        savedCount: response.data.savedCount,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Error toggling save vendor:",
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message || "Failed to update saved vendors";
      return rejectWithValue(message);
    }
  }
);

// --- Thunk: User Login ---
export const login = createAsyncThunk(
  "user/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
      const userData = response.data;

      // Store Refresh Token Securely AFTER successful login
      if (userData.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", userData.refreshToken);
      }

      // Dispatch other fetches using the logged-in user's ID
      if (userData._id) {
        dispatch(fetchAds(userData._id));
        dispatch(fetchSavedVendors(userData._id));
        // Removed: fetchUnlockedSets, fetchScore, fetchExercise
      } else {
        console.warn("Login response did not contain user ID (_id)");
      }

      return userData;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      await SecureStore.deleteItemAsync("refreshToken");
      return rejectWithValue(message);
    }
  }
);

// --- Thunk: User Registration ---
export const register = createAsyncThunk(
  "user/register",
  async (userDetails, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/register`,
        userDetails
      );
      const userData = response.data;

      // Store Refresh Token Securely AFTER successful registration
      if (userData.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", userData.refreshToken);
      }

      // Dispatch other fetches using the new user's ID
      if (userData._id) {
        dispatch(fetchAds(userData._id));
        dispatch(fetchSavedVendors(userData._id));
        // Removed: fetchUnlockedSets, fetchScore, fetchExercise
      } else {
        console.warn("Register response did not contain user ID (_id)");
      }

      return userData;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      await SecureStore.deleteItemAsync("refreshToken");
      return rejectWithValue(message);
    }
  }
);

// --- Initial State ---
const initialState = {
  currentUser: null,
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
  savedVendorIds: [],
  savedVendorCount: 0,
  // Removed: xp, score, streak, unlockedSets, exercise
};

// --- Slice Definition ---
const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut: (state) => {
      state.currentUser = null;
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
      state.savedVendorIds = [];
      state.savedVendorCount = 0;
      // Removed: xp, score, streak, unlockedSets, exercise
      SecureStore.deleteItemAsync("refreshToken").catch((err) =>
        console.log("Error removing refreshToken:", err)
      );
    },
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      state.errorMessage = "";
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setSavedVendors: (state, action) => {
      state.savedVendorIds = action.payload.savedVendorIds || [];
      state.savedVendorCount = action.payload.savedCount ?? 0;
    },
    // Removed: setExercise, setScore, setStreak, setUnlockedSets, setXp
  },
  extraReducers: (builder) => {
    builder
      // --- Login ---
      .addCase(login.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = "";
        state.savedVendorIds = [];
        state.savedVendorCount = 0;
        // Removed: xp, score, streak, exercise, unlockedSets
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.currentUser = action.payload;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(login.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
        state.currentUser = null;
        state.savedVendorIds = [];
        state.savedVendorCount = 0;
        // Removed: xp, score, streak, exercise, unlockedSets
      })

      // --- Register ---
      .addCase(register.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = "";
        state.savedVendorIds = [];
        state.savedVendorCount = 0;
        // Removed: xp, score, streak, exercise, unlockedSets
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.currentUser = action.payload;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(register.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
        state.currentUser = null;
        state.savedVendorIds = [];
        state.savedVendorCount = 0;
        // Removed: xp, score, streak, exercise, unlockedSets
      })

      // --- Update User Profile ---
      .addCase(updateUserProfile.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser = { ...state.currentUser, ...action.payload };
        }
        state.isSuccess = true;
        state.isFetching = false;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // --- Upload User Profile Image ---
      .addCase(uploadUserProfileImage.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(uploadUserProfileImage.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.isError = false;
        state.errorMessage = "";
        if (state.currentUser) {
          state.currentUser = { ...state.currentUser, ...action.payload };
        }
      })
      .addCase(uploadUserProfileImage.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // --- Delete User ---
      .addCase(deleteUser.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        // User sign out handled in signOut reducer
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // --- Toggle Save Vendor ---
      .addCase(toggleSaveVendor.pending, (state) => {
        // Optionally set a pending state
      })
      .addCase(toggleSaveVendor.fulfilled, (state, action) => {
        state.savedVendorIds = action.payload.savedVendorIds;
        state.savedVendorCount = action.payload.savedCount;
      })
      .addCase(toggleSaveVendor.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // --- Fetch Saved Vendors ---
      .addCase(fetchSavedVendors.pending, (state) => {
        // Optionally set a pending state
      })
      .addCase(fetchSavedVendors.fulfilled, (state, action) => {
        state.savedVendorIds = action.payload.savedVendorIds;
        state.savedVendorCount = action.payload.savedCount;
      })
      .addCase(fetchSavedVendors.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      });

    // Removed: fetchExercise, fetchScore, fetchUnlockedSets, fetchStreak, fetchXp cases
  },
});

// --- Export Actions and Selectors ---
export const { clearState, signOut, setUser, setSavedVendors } =
  authSlice.actions;
// Removed: setExercise, setScore, setStreak, setUnlockedSets, setXp exports

export const userSelector = (state) => state.user;
export const selectUserLoading = (state) => state.user.isFetching;
export const selectUserError = (state) => state.user.errorMessage;
export const selectIsUserLoggedIn = (state) => !!state.user.currentUser;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectSavedVendorCount = (state) => state.user.savedVendorCount;
export const selectSavedVendorIds = (state) => state.user.savedVendorIds;
// Removed: selectExercise, selectScore, selectStreak, selectUnlockedSets, selectXp selectors

export default authSlice.reducer;
