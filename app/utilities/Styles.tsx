import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // adjust path to your redux store

export const useDynamicStyles = () => {
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);

  return StyleSheet.create({
    text: {
      color: appTheme.colors!!.textColor,
      fontFamily: "font",
    },
  });
};
