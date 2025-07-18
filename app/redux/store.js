// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./authSlice";
import adsReducer from "./adsSlice";
import registryReducer from "./registrySlice";
import cartReducer from "./cartSlice";
import guestReducer from "./guestSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ads: adsReducer,
    registry: registryReducer,
    cart: cartReducer,
    guest: guestReducer,
  },
});

export default store;
