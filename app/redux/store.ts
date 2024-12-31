import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import appSlice from "./appSlice";
import businessSlice from "./businessSlice";
import walletSlice from "./walletSlice";
import categoryListSlice from "./categoryList";

export const store = configureStore({
  reducer: {
    user: userSlice,
    appTheme: appSlice,
    business: businessSlice,
    wallet: walletSlice,
    categoryLists: categoryListSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});
export const getCurrentUser = () => {
  const state = store.getState();
  return state.user.currentUser;
};
export const getBusinessCategories = () => {
  const state = store.getState();
  const categories = state.business.userBusiness.sections.filter(
    (section) => section.type === "categories"
  );
  return categories;
};
export const getValidCategoryLists = () => {
  const state = store.getState();
  return state.categoryLists.SectionList;
};
export const getUserBusiness = () => {
  const state = store.getState();
  return state.business.userBusiness;
};

export type RootState = ReturnType<typeof store.getState>;

export default store;
