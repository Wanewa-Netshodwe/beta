import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Screen from "../../utilities/Screen";
import * as ImagePicker from "expo-image-picker";
import {
  BusRegData,
  sectionData,
  StackShopLayoutParamList,
} from "../../utilities/Types";

import { SelectList } from "react-native-dropdown-select-list";
import { BE_addSection } from "../../backend/Queries";
import Carousel from "react-native-reanimated-carousel";
import { useStates } from "../../utilities/States";
import { StackScreenProps } from "@react-navigation/stack";
import OutlineBtn from "../../components/OutlineBtn";
import { useDynamicStyles } from "../../utilities/Styles";
import ClickableBtn from "../../components/ClickableBtn";
import { errorMsg } from "../../errors/catchErrors";
import { useFocusEffect } from "@react-navigation/native";

type Prop = StackScreenProps<StackShopLayoutParamList, "carousel">;
const AddCarousel: React.FC<Prop> = ({ navigation }: Prop) => {
  const createRandomId = useCallback(() => {
    return Math.random().toString(36).substring(2, 27);
  }, []);
  console.log("addcarousel scrren called");
  const { width } = Dimensions.get("window");
  const styles = useDynamicStyles();
  const dispatch = useDispatch();
  const { appTheme, businessSections } = useStates();
  const businessData = businessSections;
  const [img, setImg] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [Position, setPosition] = useState("");
  const [height, setHeight] = useState(200);
  const [speed, setSpeed] = useState(3);
  const [carouselSpeed, setCarouselSpeed] = useState(3);
  const [carouselType, setCarouselType] = useState("horizantal");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<{ key: number; value: string }[]>([]);
  const [d, setD] = useState<{ key: string; value: number }[]>([]);
  const updateData = useCallback(() => {
    setShow(true);
    const dataDummy: { key: string; index: number }[] = businessData
      .filter((item, idx) => item.valid)
      .map((item, idx) => ({ key: item.name, index: idx }));

    const updatedData = dataDummy.flatMap((item) => [
      { key: item.index, value: "Before " + item.key },
      { key: item.index + 1, value: "After " + item.key },
    ]);

    const updatedD = dataDummy.flatMap((item) => [
      { key: "Before " + item.key, value: item.index },
      { key: "After " + item.key, value: item.index + 1 },
    ]);

    setData(updatedData);
    setD(updatedD);
  }, [businessData]);

  useFocusEffect(
    useCallback(() => {
      updateData();
      return () => {
        setData([]);
        setD([]);
      };
    }, [updateData])
  );

  const handleSubmit = () => {
    if (!name || !img || !Position) {
      errorMsg("Fill in all fields to Continue");
      return;
    }

    const r =
      d.length < 1
        ? [0]
        : d.filter((item) => item.key === Position).map((item) => item.value);

    let num = r[0];
    if (num !== undefined || num === 0) {
      const sectionData: sectionData = {
        id: createRandomId(),
        valid: true,
        name: name,
        postion: num,
        imgs: img,
        businessid: businessData.id,
        type: "Carousel",
        height: height,
        properties: {
          carouselType: carouselType,
          carouselSpeed: speed * 1000,
        },
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
    setImg([]);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    const data = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!data.canceled) {
      const newImages = data.assets.map((asset) => asset.uri);
      setImg((prev) => [...prev, ...newImages]); // Append new images to the existing state
    }
  };
  if (show) {
    return (
      <View className="w-full h-full ">
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className=" mt-2 p-[5%]"
        >
          <Text style={styles.text} className={`text-[24px] font-bold`}>
            Add Carousel
          </Text>
        </View>
        <ScrollView>
          <View
            style={{ backgroundColor: appTheme.colors?.primary }}
            className=" mt-2 pb-10 p-[5%]"
          >
            <View className=" flex-row items-center gap-7">
              <TouchableNativeFeedback>
                <OutlineBtn
                  title=" Upload Images"
                  onPress={handleImageUpload}
                />
              </TouchableNativeFeedback>

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
              <View
                className="bg-transparent rounded-md p-1  w-[20%] relative"
                style={{
                  borderColor: appTheme.colors?.secondary,
                  borderWidth: 2,
                }}
              >
                <Text
                  style={styles.text}
                  className="text-[9px] w-[73px] text-center absolute -bottom-7 -left-1 font-bold"
                >
                  Carousel speed in seconds
                </Text>
                <TextInput
                  className="text-center"
                  keyboardType={"number-pad"}
                  onChangeText={(t) => {
                    setCarouselSpeed(Number(t));
                  }}
                  onEndEditing={() => {
                    setSpeed(carouselSpeed);
                  }}
                  value={carouselSpeed.toString()}
                  style={styles.text}
                />
              </View>
            </View>
          </View>
          <View
            style={{ backgroundColor: appTheme.colors?.primary }}
            className=" mt-2 "
          >
            <View className="p-[5%]">
              <Text style={styles.text} className="text-[18px] font-semibold">
                Carousel Preview
              </Text>
            </View>
            <View style={{ width: width }} className="   h-fit ">
              {img.length > 0 && (
                <Carousel
                  loop={true}
                  {...(carouselType === "vertical" ? { vertical: true } : {})}
                  autoPlayInterval={speed * 1000}
                  style={{ marginTop: 10 }}
                  width={width}
                  height={height}
                  data={img}
                  autoPlay={true}
                  scrollAnimationDuration={speed * 1000}
                  renderItem={({ item }) => (
                    <Image
                      resizeMethod="resize"
                      resizeMode="cover"
                      height={height}
                      width={width}
                      source={{ uri: item }}
                    />
                  )}
                />
              )}
            </View>
          </View>
          <View
            style={{ backgroundColor: appTheme.colors?.primary }}
            className=" mt-2 p-[5%]"
          >
            <View className="">
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
          <View
            style={{ backgroundColor: appTheme.colors?.primary }}
            className=" mt-2 p-[5%]"
          >
            <View className="">
              <Text style={styles.text} className="text-[18px] font-semibold">
                Carousel Type
              </Text>
            </View>
            <View className="mt-[5%]">
              <SelectList
                setSelected={(val: string) => setCarouselType(val)}
                data={[
                  { key: "vertical", value: "vertical" },
                  { key: "horizontal", value: "horizontal" },
                ]}
                save="value"
                inputStyles={styles.text}
                dropdownTextStyles={styles.text}
                placeholder="Carousel Type"
                search={false}
              />
            </View>
          </View>
          <View
            style={{ backgroundColor: appTheme.colors?.primary }}
            className=" mt-2 p-[5%]"
          >
            <View className=" ">
              <Text style={styles.text} className="text-[18px] font-semibold">
                Section Name
              </Text>
            </View>
            <View className="mt-[3%]">
              <TextInput
                placeholder="Section Name"
                placeholderTextColor={appTheme.colors?.textColor}
                placeholderClassName="font-bold"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                }}
                style={[
                  {
                    borderBottomWidth: 2,
                    borderBottomColor: appTheme.colors?.background,
                    backgroundColor: "transparent",
                  },
                  styles.text,
                ]}
                className="rounded-sm py-3 w-[70%]"
              ></TextInput>
            </View>
          </View>
          <View className="flex-row  gap-10 p-[5%] items-center ">
            <ClickableBtn width={120} onPress={handleSubmit} title="Save" />
            <ClickableBtn
              width={125}
              onPress={() => {
                navigation.popTo("home");
              }}
              title="Cancel"
            />
          </View>
        </ScrollView>
      </View>
    );
  }
};
export default memo(AddCarousel);
