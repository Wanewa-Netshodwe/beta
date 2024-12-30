import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  ScrollView,
  Animated,
  StyleSheet,
} from "react-native";
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Screen from "../../utilities/Screen";
import * as ImagePicker from "expo-image-picker";
import {
  BusRegData,
  category,
  StackShopLayoutParamList,
  sectionData,
} from "../../utilities/Types";

import { BE_addC, BE_addSection } from "../../backend/Queries";
import { SelectList } from "react-native-dropdown-select-list";
import { StackScreenProps } from "@react-navigation/stack";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import ClickableBtn from "../../components/ClickableBtn";
type prop = StackScreenProps<StackShopLayoutParamList, "category">;
const Category: React.FC<prop> = ({ route, navigation }) => {
  console.log('category scrren called')
  const styles = useDynamicStyles();
  const { id } = route.params;
  const { appTheme } = useStates();
  const dispatch = useDispatch();

  const [img, setImg] = useState("");
  const [Position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const handleSubmit = () => {
    const category: category = {
      id: id,
      img: img,
      name: title,
    };
    BE_addC(category, dispatch);
    navigation.navigate("categoryList");
  };
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this   work!");
      return;
    }
    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!data.canceled) {
      setImg(data.assets[0].uri);
    }
  };

  return (
    <View className="w-full h-full ">
      <View style={styles.sections} className="">
        <Text style={styles.text} className={`text-[24px] font-bold`}>
          Add Category
        </Text>
      </View>
      <ScrollView>
        <View style={styles.sections} className="mt-1">
          <View >
            <Text style={styles.text} className="text-[18px] font-semibold">
              Name
            </Text>
          </View>
          <View >
            <TextInput
            placeholder="Category name"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
              placeholderTextColor={appTheme.colors?.textColor}
              style={styles.inputs}
              className=" rounded-sm py-3 w-[70%] "
            ></TextInput>
          </View>
        </View>
        <View style={styles.sections} className="mt-2">
          <View >
            <Text style={styles.text} className="text-[18px] font-semibold">
              Icon
            </Text>
          </View>

          <TouchableNativeFeedback onPress={handleImageUpload}>
            <View className="mt-[5%] w-[30%] rounded-full">
              {img ? (
                <>
                  <Image
                    width={50}
                    height={50}
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
                      backgroundColor: appTheme.colors?.background,
                    }}
                    className=" rounded-sm py-14  w-[100%] "
                  ></View>
                </>
              )}
            </View>
          </TouchableNativeFeedback>
        </View>
        <View className=" px-[5%] justify-between">
         <ClickableBtn 
         title="Save"
         width={120}
         onPress={handleSubmit}
         />
          
        </View>
      </ScrollView>
    </View>
  );
};
export default Category;
