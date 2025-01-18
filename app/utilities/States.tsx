import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // adjust path to your redux store
import { useMemo } from "react";

export const useStates = () => {
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  const current_screen = useSelector(
    (state: RootState) => state.screens.current_screen
  );
  const businessSections = useSelector(
    (state: RootState) => state.business.userBusiness.sections
  );

  const businessId = useSelector(
    (state: RootState) => state.business.userBusiness.id
  );
  const businessName = useSelector(
    (state: RootState) => state.business.userBusiness.store_name
  );
  const guestId = useSelector((state: RootState) => state.user.guestId);
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
  const lastvisitedBusiness = useSelector(
    (state: RootState) => state.analytics.lastVistedBusiness
  );

  const userState = useSelector((state: RootState) => state.user);
  const walletState = useSelector((state: RootState) => state.wallet);
  const AllBusiness = useSelector(
    (state: RootState) => state.business.allBusinesses
  );
  const CategoryListState = useSelector(
    (state: RootState) => state.categoryLists
  );

  const states = useMemo(
    () => ({
      guestId,
      appTheme,
      lastvisitedBusiness,
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
      current_screen,
    }),
    [
      guestId,
      AllBusiness,
      current_screen,
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
      lastvisitedBusiness,
    ]
  );
  return states;
};
