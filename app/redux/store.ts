import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import appSlice from "./appSlice";
import businessSlice from "./businessSlice";
import walletSlice from "./walletSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    appTheme: appSlice,
    business: businessSlice,
    wallet: walletSlice,
  },
});
export const getCurrentUser = () => {
  const state = store.getState();
  return state.user.currentUser;
};
export const getUserBusiness = () => {
  const state = store.getState();
  return state.business.userBusiness;
};

export type RootState = ReturnType<typeof store.getState>;

export default store;
