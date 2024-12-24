import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // adjust path to your redux store

export const useStates = () => {
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  const businessState = useSelector((state: RootState) => state.business);
  const userState = useSelector((state: RootState) => state.user);
  const walletState = useSelector((state: RootState) => state.wallet);
  const states = {
    appTheme: appTheme,
    businessState,
    userState,
    walletState,
  };
  return states;
};
