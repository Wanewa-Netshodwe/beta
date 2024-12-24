import Constants from "expo-constants";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  TouchableNativeFeedback,
  View,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type props = {
  children: React.JSX.Element;
};
export default function Screen({ children }: props) {
  const appTheme = useSelector(
    (state: RootState) => state.appTheme.appTheme.colors
  );
  return (
    <SafeAreaView
      className={`h-full w-full`}
      style={{
        paddingTop: Constants.statusBarHeight,
        backgroundColor: appTheme?.background,
      }}
    >
      {children}
    </SafeAreaView>
  );
}
