import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Screen from "../../../utilities/Screen";



import { BE_signup_Business } from "../../../backend/Queries";
import { useNavigation } from "@react-navigation/native";

export default function Summary() {
  const navigator = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const busRegData = useSelector((state: RootState) => state.user.busRegData);
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  const handleSubmit = () => {
    setLoading(true);
    BE_signup_Business(busRegData, setLoading, dispatch);
  };

  return (
    <Screen>
      <View className="w-full h-full  p-[5%]">
        <Text
          style={{ color: appTheme.colors.tertiary }}
          className={`text-[24px] font-bold`}
        >
          Create Business
        </Text>
        <View className="mt-[5%]">
          <Text
            style={{ color: appTheme.colors.tertiary }}
            className="text-[20px] font-semibold"
          >
            Summary
          </Text>
          <View
            style={{ backgroundColor: appTheme.colors.secondary }}
            className="w-[100%] gap-1 p-2 mt-[4%] rounded-md"
          >
            <View className="flex-row gap-4 items-center  ">
              <Text
                style={{ color: appTheme.colors.tertiary, width: "auto" }}
                className="text-[17px] font-bold  "
              >
                Business Name :
              </Text>
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-semibold w-fit"
              >
                {busRegData.name}
              </Text>
            </View>

            <View className="flex-row gap-4 items-center  ">
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-bold border-2 border-transparent"
              >
                Business Logo :
              </Text>
              <Image
                source={{ uri: busRegData.pic }}
                width={90}
                height={30}
                className="w-fit"
              />
            </View>
            <View className="flex-row gap-4 items-center  ">
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-bold border-2 border-transparent"
              >
                Admin Password :
              </Text>
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-semibold "
              >
                {busRegData.password}
              </Text>
            </View>
            <View className="flex-row gap-4 items-center  ">
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-bold border-2 border-transparent"
              >
                opening time :
              </Text>
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-semibold"
              >
                {busRegData.business_hours?.opening}
              </Text>
            </View>
            <View className="flex-row gap-4 items-center  ">
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-bold border-2 border-transparent"
              >
                closing time :
              </Text>
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-semibold"
              >
                {busRegData.business_hours?.closing}
              </Text>
            </View>
            <View className="flex-row gap-4 items-center  ">
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-bold border-2 border-transparent"
              >
                Location :
              </Text>
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-semibold"
              >
                {busRegData.location?.address.slice(0, 20) + "..."}
              </Text>
            </View>
            <View className="flex-row gap-2 items-center  ">
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-bold border-2 border-transparent"
              >
                Business Offering :
              </Text>
              <Text
                style={{ color: appTheme.colors.tertiary }}
                className="text-[17px] font-semibold"
              >
                {busRegData.offering}
              </Text>
            </View>
          </View>
        </View>
        <TouchableNativeFeedback onPress={handleSubmit}>
          <View
            style={{ backgroundColor: appTheme.colors.tertiary }}
            className={` p-3  mt-[15%]  rounded-md  ${
              loading ? "w-[46%]" : "w-[40%]"
            }  flex-row gap-3 items-center`}
          >
            <Text className="text-[25px] font-bold  ">Confirm</Text>
            
          </View>
        </TouchableNativeFeedback>
      </View>
    </Screen>
  );
}
