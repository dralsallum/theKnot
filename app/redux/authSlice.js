// redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchUnlockedSets } from "./lessonsSlice";
import { fetchScore, updateScore } from "./scoreSlice";
import { fetchAds, updateAds } from "./adsSlice";
import { fetchExercise, updateExercise } from "./exerciseSlice";
import * as SecureStore from "expo-secure-store";

// Thunk to upload a profile image
export const uploadUserProfileImage = createAsyncThunk(
  "user/uploadUserProfileImage",
  async ({ userId, imageAsset }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const accessToken = state.user.currentUser?.accessToken;

      // Prepare the form data
      const formData = new FormData();
      // The field name must match multer's .single("profileImage")
      formData.append("profileImage", {
        uri: imageAsset.uri,
        name: imageAsset.fileName || `photo.${imageAsset.type?.split("/")[1]}`,
        type: imageAsset.type || "image/jpeg",
      });

      // Make the request
      const response = await axios.post(
        `https://theknot-30278e2ff419.herokuapp.com/api/users/${userId}/upload-profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // response.data.user will be the updated user including profileImage
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk to update streak count
export const updateStreakCount = createAsyncThunk(
  "user/updateStreakCount",
  async ({ userId }, thunkAPI) => {
    try {
      const response = await axios.put(
        `https://theknot-30278e2ff419.herokuapp.com/api/users/streak/${userId}`
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, updates }, thunkAPI) => {
    try {
      // Get the user's access token from the state
      const state = thunkAPI.getState();
      const accessToken = state.user.currentUser?.accessToken;

      const response = await axios.put(
        `https://theknot-30278e2ff419.herokuapp.com/api/users/profile/${userId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk to delete user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ userId }, thunkAPI) => {
    try {
      // Get the user's access token from the state
      const state = thunkAPI.getState();
      const accessToken = state.user.currentUser?.accessToken;

      await axios.delete(
        `https://theknot-30278e2ff419.herokuapp.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // After successful deletion, dispatch signOut to clear user state
      thunkAPI.dispatch(signOut());

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for user login
export const login = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://theknot-30278e2ff419.herokuapp.com/api/auth/login",
        credentials
      );

      // Dispatch fetchUnlockedSets after a successful login
      thunkAPI.dispatch(fetchUnlockedSets(response.data._id));

      // Dispatch updateStreakCount after successful login

      // Dispatch fetchScore to get the user's score
      thunkAPI.dispatch(fetchScore(response.data._id));

      // Dispatch fetchScore to get the user's score
      thunkAPI.dispatch(fetchAds(response.data._id));

      // Dispatch fetchExercise to get the user's score
      thunkAPI.dispatch(fetchExercise(response.data._id));

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for user registration
export const register = createAsyncThunk(
  "user/register",
  async (userDetails, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://theknot-30278e2ff419.herokuapp.com/api/auth/register",
        userDetails
      );

      // Dispatch fetchUnlockedSets after a successful registration
      thunkAPI.dispatch(fetchUnlockedSets(response.data._id));

      // Dispatch updateStreakCount after successful registration

      // Dispatch fetchScore to get the user's score
      thunkAPI.dispatch(fetchScore(response.data._id));

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  currentUser: null,
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

// Slice for user authentication
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut: (state) => {
      state.currentUser = null;
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
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
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(login.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.currentUser = action.payload;
        if (action.payload.refreshToken) {
          SecureStore.setItemAsync(
            "refreshToken",
            action.payload.refreshToken
          ).catch((err) => console.log("Error storing refreshToken:", err));
        }
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(login.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Handle register
      .addCase(register.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.currentUser = action.payload;
        if (action.payload.refreshToken) {
          SecureStore.setItemAsync(
            "refreshToken",
            action.payload.refreshToken
          ).catch((err) => console.log("Error storing refreshToken:", err));
        }

        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(register.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Handle updateStreakCount
      .addCase(updateStreakCount.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.streak = action.payload.streak; // Adjust according to your backend response
        }
      })
      .addCase(updateStreakCount.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Handle updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(uploadUserProfileImage.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(uploadUserProfileImage.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.isError = false;
        state.errorMessage = "";

        // action.payload is the updated user object from the server
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload, // merges updated fields (like profileImage)
          };
        }
      })
      .addCase(uploadUserProfileImage.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload,
          };
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
      // Handle deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.currentUser = null;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

// Export the actions
export const { clearState, signOut, setUser } = userSlice.actions;

// **Selectors**
export const userSelector = (state) => state.user;
export const selectCurrentUser = (state) => state.user.currentUser;

// Export the reducer
export default userSlice.reducer;
