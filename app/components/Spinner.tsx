import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useStates } from "../utilities/States";

export default function Spinner() {
  const { appTheme } = useStates();

  return (
    <View
      style={{
        backgroundColor: appTheme.colors?.primary,
        borderLeftColor: appTheme.colors?.background,
        borderRightColor: appTheme.colors?.background,
        borderBottomColor: appTheme.colors?.background,
        borderTopColor: appTheme.colors?.secondary,
        borderWidth: 3,
        borderRadius: 10,
      }}
      className="animate-spin  w-6 h-6 "
    ></View>
  );
}
