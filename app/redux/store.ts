import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import appSlice from "./appSlice";
import businessSlice from "./businessSlice";
import walletSlice from "./walletSlice";
import categoryListSlice from "./categoryList";
import CartHolderItemsSlice from "./CartItemSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    appTheme: appSlice,
    business: businessSlice,
    wallet: walletSlice,
    categoryLists: categoryListSlice,
    cartHolderItems: CartHolderItemsSlice,
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
export const getDiscountProducts = () => {
  const state = store.getState();
  return state.business.discountedProducts;
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
export const getBusinessById = (id: string) => {
  const state = store.getState();
  const targetBusiness = state.business.allBusinesses.filter(
    (bus) => bus.id === id
  );
  return targetBusiness ? targetBusiness[0] : undefined;
};
export const getUserId = () => {
  const state = store.getState();
  return state.user.currentUser.id;
};

export type RootState = ReturnType<typeof store.getState>;

export default store;
