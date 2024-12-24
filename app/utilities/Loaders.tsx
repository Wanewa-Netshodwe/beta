import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
type prop = {
  width?: number;
};
export const TextLoader = ({ width }: prop) => {
  const colors = useSelector(
    (state: RootState) => state.appTheme.appTheme.colors
  );
  return (
    <View
      style={{
        backgroundColor: colors?.secondary,
        width: (width && width * 8) || 90,
      }}
      className="animate-ping w-[150px] h-[15px]  mt-5 rounded-full "
    ></View>
  );
};
