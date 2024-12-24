import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useStates } from "./States";
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
export const ChangeThemeLoader = ({ width }: prop) => {
  const { appTheme } = useStates();

  return (
    <View className="p-5">
      <View className="mt-6 ">
        <View className="mt-2 mb-4">
          <View
            className=" animate-ping w-[120px] h-[20px]"
            style={{ backgroundColor: appTheme.colors?.secondary }}
          ></View>
        </View>
        <View className=" flex-row gap-7 items-center">
          <View
            style={{
              backgroundColor: appTheme.colors?.secondary,
            }}
            className=" animate-ping   w-[120px] h-[100px] rounded-md "
          ></View>
          <View
            style={{
              backgroundColor: appTheme.colors?.secondary,
            }}
            className="animate-ping w-[120px]  h-[100px] rounded-md "
          ></View>
        </View>
        <TouchableNativeFeedback
          onPress={() => {
            // setShowModal(true);
          }}
        >
          <View className="mt-5 w-[180px]  animate-ping  self-end right-5  rounded-md  ">
            <View
              style={{
                backgroundColor: appTheme.colors?.secondary,
                width: "60%",
                height: 25,
                alignSelf: "flex-end",
              }}
              className=" mb-3"
            />
            <View
              style={{
                backgroundColor: appTheme.colors?.secondary,
                width: "100%",
                height: 25,
              }}
            />
          </View>
        </TouchableNativeFeedback>
      </View>

      <View className="mt-6 ">
        <View className="mt-2 mb-4">
          <View
            className=" animate-ping w-[120px] h-[20px]"
            style={{ backgroundColor: appTheme.colors?.secondary }}
          ></View>
        </View>
        <View className=" flex-row gap-7 items-center">
          <View
            style={{
              backgroundColor: appTheme.colors?.secondary,
            }}
            className=" animate-ping   w-[120px] h-[100px] rounded-md "
          ></View>
          <View
            style={{
              backgroundColor: appTheme.colors?.secondary,
            }}
            className="animate-ping w-[120px]  h-[100px] rounded-md "
          ></View>
        </View>
      </View>
    </View>
  );
};
