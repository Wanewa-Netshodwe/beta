import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // adjust path to your redux store
import { useMemo } from "react";

export const useDynamicStyles = () => {
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          color: appTheme.colors!!.textColor,
          fontFamily: appTheme.fonts?.primary,
        },
        inputs: {
          borderBottomColor: appTheme.colors?.background,
          borderBottomWidth: 2,
          backgroundColor: "transparent",
          color: appTheme.colors!!.textColor,
          fontFamily: appTheme.fonts?.primary,
        },
        sections: {
          backgroundColor: appTheme.colors?.primary,
          padding: "5%",
        },
      }),

    [appTheme]
  );
  return styles;
};
