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
import * as ImagePicker from "expo-image-picker";
import { BusRegData } from "../../../utilities/Types";
import { setRegData } from "../../../redux/userSlice";
import { useNavigation } from "@react-navigation/native";


export default function Start() {
  const navigator = useNavigation();
  const dispatch = useDispatch();
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const next = () => {
    const reg: BusRegData = {
      name: name,
      password: password,
      pic: img,
    };
    dispatch(setRegData(reg));
    navigator.navigate("Businessinfo");
  };
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this   work!");
      return;
    }
    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!data.canceled) {
      setImg(data.assets[0].uri);
    }
  };
  return (
    <Screen>
      <View className="w-full h-full  p-[5%]">
        <View className="">
          <Text
            style={{ color: appTheme.colors?.tertiary }}
            className={`text-[24px] font-bold`}
          >
            Create Business
          </Text>
        </View>
        <View>
          <View className="mt-[10%]">
            <Text
              style={{ color: appTheme.colors?.tertiary }}
              className="text-[18px] font-semibold"
            >
              Business name
            </Text>
          </View>
          <View className="mt-[5%]">
            <TextInput
              onChangeText={(text) => {
                setName(text);
              }}
              style={{
                color: appTheme.colors?.tertiary,
                backgroundColor: appTheme.colors?.secondary,
              }}
              className=" rounded-sm py-3 w-[70%] "
            ></TextInput>
          </View>
        </View>
        <View>
          <View className="mt-[10%]">
            <Text
              style={{ color: appTheme.colors?.tertiary }}
              className="text-[18px] font-semibold"
            >
              Business Logo
            </Text>
          </View>
          <TouchableNativeFeedback onPress={handleImageUpload}>
            <View className="mt-[5%] w-[70%]">
              {img ? (
                <>
                  <Image
                    width={200}
                    height={150}
                    borderRadius={5}
                    source={{
                      uri: img,
                    }}
                  />
                </>
              ) : (
                <>
                  <View
                    style={{
                      backgroundColor: appTheme.colors?.secondary,
                    }}
                    className=" rounded-sm py-14 w-[100%] "
                  ></View>
                </>
              )}
            </View>
          </TouchableNativeFeedback>
        </View>
        <View>
          <View className="mt-[10%]">
            <Text
              style={{ color: appTheme.colors?.tertiary }}
              className="text-[18px] font-semibold"
            >
              Admin Password
            </Text>
          </View>
          <View className="mt-[5%]">
            <TextInput
              onChangeText={(text) => {
                setPassword(text);
              }}
              secureTextEntry
              style={{
                color: appTheme.colors?.tertiary,
                backgroundColor: appTheme.colors?.secondary,
              }}
              className=" rounded-sm py-3 w-[70%] "
            ></TextInput>
          </View>
        </View>
        <TouchableNativeFeedback
          onPress={() => {
            next();
          }}
        >
          <View
            style={{ backgroundColor: appTheme.colors?.tertiary }}
            className=" py-2 mt-[15%]  rounded-md  w-[40%]"
          >
            <Text className="text-[25px] w-fit font-bold text-center">
              {" "}
              Next
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </Screen>
  );
}
