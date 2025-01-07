import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // adjust path to your redux store
import { useMemo } from "react";

export const useStates = () => {
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  const businessSections = useSelector(
    (state: RootState) => state.business.userBusiness.sections
  );
  const discountProducts = useSelector(
    (state: RootState) => state.business.discountedProducts
  );
  const businessId = useSelector(
    (state: RootState) => state.business.userBusiness.id
  );
  const businessName = useSelector(
    (state: RootState) => state.business.userBusiness.store_name
  );
  const businessPic = useSelector(
    (state: RootState) => state.business.userBusiness.store_pic
  );
  const businessVerified = useSelector(
    (state: RootState) => state.business.userBusiness.verified
  );
  const businessForeground = useSelector(
    (state: RootState) => state.business.userBusiness.foregroundImg
  );
  const businessState = useSelector(
    (state: RootState) => state.business.userBusiness
  );

  const userState = useSelector((state: RootState) => state.user);
  const walletState = useSelector((state: RootState) => state.wallet);
  const AllBusiness = useSelector(
    (state: RootState) => state.business.allBusinesses
  );
  const CategoryListState = useSelector(
    (state: RootState) => state.categoryLists
  );
  const CartState = useSelector((state: RootState) => state.user.cart);

  const states = useMemo(
    () => ({
      CartState,
      appTheme,
      businessState,
      businessSections,
      userState,
      walletState,
      CategoryListState,
      businessForeground,
      businessName,
      businessPic,
      businessVerified,
      businessId,
      AllBusiness,
      discountProducts,
    }),
    [
      discountProducts,
      CartState,
      AllBusiness,
      appTheme,
      businessState,
      businessForeground,
      businessName,
      businessPic,
      businessVerified,
      businessSections,
      userState,
      walletState,
      CategoryListState,
    ]
  );
  return states;
};
