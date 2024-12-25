import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Screen from "../../utilities/Screen";
import * as ImagePicker from "expo-image-picker";
import { BusRegData, sectionData } from "../../utilities/Types";

import { useNavigation } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import { BE_addSection } from "../../backend/Queries";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import ClickableBtn from "../../components/ClickableBtn";
import { StackScreenProps } from "@react-navigation/stack";
import { StackShopLayoutParamList } from "../../utilities/Types";
type prop = StackScreenProps<StackShopLayoutParamList, "banner">;
const AddBanner: React.FC<prop> = ({ navigation }) => {
  const { width } = Dimensions.get("screen");
  const dispatch = useDispatch();
  const { businessState, appTheme } = useStates();
  const businessData = businessState.userBusiness;
  const [img, setImg] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [Position, setPosition] = useState("");
  const [height, setHeight] = useState(200);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ key: number; value: string }[]>([]);
  const [d, setD] = useState<{ key: string; value: number }[]>([]);
  const styles = useDynamicStyles();
  useMemo(() => {
    let dataDummy: { key: string; index: number }[] | null =
      businessData.sections.length > 0 ? [] : null;
    businessData.sections.map((item, idx) => {
      if (item.valid)
        if (dataDummy) dataDummy.push({ key: item.name, index: idx });
    });
    dataDummy?.map((item) => {
      setData((prev) => [
        ...prev,
        { key: item.index, value: "Before " + item.key },
      ]);
      setData((prev) => [
        ...prev,
        { key: item.index + 1, value: "After " + item.key },
      ]);
      setD((prev) => [
        ...prev,
        { key: "Before " + item.key, value: item.index },
      ]);
      setD((prev) => [
        ...prev,
        { key: "AFter " + item.key, value: item.index + 1 },
      ]);
    });
  }, []);
  useEffect(() => {}, []);

  const handleSubmit = () => {
    console.log(d.length < 1);
    const r =
      d.length < 1
        ? [0]
        : d.filter((item) => item.key === Position).map((item) => item.value);

    console.log(r);
    let num = r[0];
    console.log("number : ", num);
    if (num !== undefined || num === 0) {
      const sectionData: sectionData = {
        valid: true,
        name: name,
        postion: num,
        imgs: img,
        businessid: businessData.id,
        type: "Banner",
        height: height,
      };
      const data = {
        sectionInfo: sectionData,
        loading: setLoading,
        dispatch: dispatch,
        navigator: navigation,
      };
      BE_addSection(data);
    }
  };
  const cancel = () => {
    navigation.navigate("home");
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
      aspect: [16, 9],
      quality: 1,
    });

    if (!data.canceled) {
      const newImages = data.assets.map((asset) => asset.uri);
      setImg((prev) => [...prev, ...newImages]); // Append new images to the existing state
    }
  };
  return (
    
      <ScrollView>
        <View style={{ backgroundColor: appTheme.colors?.background }} className="w-full h-full  p-[5%]">
          <View className="">
            <Text style={styles.text} className={`text-[24px] font-bold`}>
              Add Banner
            </Text>
          </View>
          <View>
            <View className="mt-[10%]"></View>
            <TouchableNativeFeedback onPress={handleImageUpload}>
              <View
                className="bg-transparent rounded-md p-2 w-[35%]"
                style={{
                  borderColor: appTheme.colors?.secondary,
                  borderWidth: 2,
                }}
              >
                <Text style={styles.text}>Upload Banner</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View
            className="bg-transparent rounded-md p-1  w-[20%] relative"
            style={{
              borderColor: appTheme.colors?.secondary,
              borderWidth: 2,
            }}
          >
            <Text
              style={styles.text}
              className="text-[9px] text-center absolute -bottom-7 left-3 font-bold"
            >
              Carousel height
            </Text>
            <TextInput
              className="text-center"
              placeholder="Enter Height"
              keyboardType={"number-pad"}
              onChangeText={(t) => {
                setHeight(Number(t));
              }}
              value={height.toString()}
              style={styles.text}
            />
          </View>
          <View>
            <View className="mt-[10%]">
              <Text style={styles.text} className="text-[18px] font-semibold">
                Banner Preview
              </Text>
            </View>
            <TouchableNativeFeedback onPress={handleImageUpload}>
              <View className="mt-[5%] w-[280px] ">
                {img ? (
                  <>
                    <Image
                      width={width}
                      height={height}
                      borderRadius={5}
                      source={{
                        uri: img[0],
                      }}
                    />
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        backgroundColor: appTheme.colors?.secondary,
                      }}
                      className=" rounded-sm py-14 w-[100%] h-[200px] "
                    ></View>
                  </>
                )}
              </View>
            </TouchableNativeFeedback>
          </View>
          <View>
            <View className="mt-[10%]">
              <Text style={styles.text} className="text-[18px] font-semibold">
                Position
              </Text>
            </View>
            <View className="mt-[5%]">
              <SelectList
                setSelected={(val: string) => setPosition(val)}
                data={data.length > 0 ? data : [{ key: 0, value: "First" }]}
                save="value"
                inputStyles={styles.text}
                dropdownTextStyles={styles.text}
                placeholder="Postion"
                search={false}
              />
            </View>
          </View>
          <View>
            <View className="mt-[10%]">
              <Text style={styles.text} className="text-[18px] font-semibold">
                Section Name
              </Text>
            </View>
            <View className="mt-[5%]">
              <TextInput
                onChangeText={(text) => {
                  setName(text);
                }}
                style={[
                  {
                    backgroundColor: appTheme.colors?.secondary,
                  },
                  styles.text,
                ]}
                className=" rounded-sm py-3 w-[70%] "
              ></TextInput>
            </View>
          </View>
          <View className=" flex-rows justify-between">
            {/* <TouchableNativeFeedback
              onPress={() => {
                handleSubmit();
              }}
            >
              <View
                style={{ backgroundColor: appTheme.colors?.secondary }}
                className=" py-2 mt-[15%]  rounded-md  w-[50%] self-center "
              >
                <Text className="text-[25px] w-fit font-bold text-center">
                  {" "}
                  Save
                </Text>
              </View>
            </TouchableNativeFeedback> */}
            <ClickableBtn
              onPress={() => {
                console.log(d.length < 1);
                const r =
                  d.length < 1
                    ? [0]
                    : d
                        .filter((item) => item.key === Position)
                        .map((item) => item.value);

                console.log(r);
                let num = r[0];
                console.log("number : ", num);
                if (num !== undefined || num === 0) {
                  const sectionData: sectionData = {
                    valid: true,
                    name: name,
                    postion: num,
                    imgs: img,
                    businessid: businessData.id,
                    type: "Banner",
                    height: height,
                  };
                  const data = {
                    sectionInfo: sectionData,
                    loading: setLoading,
                    dispatch: dispatch,
                    navigator: navigation,
                  };
                  BE_addSection(data);
                }
              }}
              title="Save"
            />
            {/* <TouchableNativeFeedback
              onPress={() => {
                cancel();
              }}
            >
              <View
                style={{ backgroundColor: appTheme.colors.tertiary }}
                className=" py-2 mt-[15%]  rounded-md  w-[50%] self-center "
              >
                <Text className="text-[25px] w-fit font-bold text-center">
                  {" "}
                  Cancel
                </Text>
              </View>
            </TouchableNativeFeedback> */}
            <ClickableBtn
              onPress={() => {
                navigation.navigate("home");
              }}
              title="Cancel"
            />
          </View>
        </View>
      </ScrollView>
   
  );
};
export default AddBanner;
