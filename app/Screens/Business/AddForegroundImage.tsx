import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import { StackScreenProps } from "@react-navigation/stack";
import { StackShopLayoutParamList } from "../../utilities/Types";
import OutlineBtn from "../../components/OutlineBtn";
import SearchBar from "../../components/SearchBar";
import ClickableBtn from "../../components/ClickableBtn";
import { useDispatch } from "react-redux";
import { setForegroundImg } from "../../redux/businessSlice";

type Props = StackScreenProps<StackShopLayoutParamList, "foregroundImg">;
const AddForegroundImage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const styles = useDynamicStyles();
  const { appTheme } = useStates();
  const [img, setImg] = useState<string>();
  const { width } = Dimensions.get("screen");
  const handleImageUpload = async () => {
    console.log(img);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this   work!");
      return;
    }
    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      aspect: [16, 9],
      quality: 1,
    });

    if (!data.canceled) {
      setImg(data.assets[0].uri);
    }
  };
  return (
    <View
      style={{ backgroundColor: appTheme.colors?.background }}
      className="w-full h-full p-[5%] "
    >
      <ScrollView>
        <View className="">
          <Text style={styles.text} className={`text-[24px] font-bold`}>
            Add Foreground
          </Text>
        </View>
        <View className="mt-[8%]"></View>
        <OutlineBtn
          width={180}
          title="Upload Foreground Image"
          onPress={handleImageUpload}
        />

        <View className="mt-[10%]">
          <Text style={styles.text} className="text-[18px] font-semibold">
            Foreground Preview
          </Text>
        </View>

        <View className="mt-[10%] items-center">
          {img ? (
            <View
              className="w-full border-2 relative border-green-700"
              style={{ width: width, height: 200 }}
            >
              <ImageBackground
                className="flex-1"
                source={{ uri: img }}
                resizeMode="cover"
              />
              <View className="absolute  top-36 w-full">
                <SearchBar />
              </View>
            </View>
          ) : (
            <View
              style={{
                width: width - 45,
                height: 230,
                backgroundColor: appTheme.colors?.tertiary,
              }}
            >
              <SearchBar />
            </View>
          )}
        </View>
        <View className="mt-5">
          <ClickableBtn
            onPress={() => {
              dispatch(setForegroundImg(img));
              navigation.navigate("home");
            }}
            title="Save"
          />
          <ClickableBtn
            onPress={() => {
              navigation.navigate("home");
            }}
            title="Cancel"
          />
        </View>

        <View style={{ height: 20 }}></View>
      </ScrollView>
    </View>
  );
};

export default AddForegroundImage;
