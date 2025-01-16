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
import React, { useState, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Screen from "../../utilities/Screen";
import * as ImagePicker from "expo-image-picker";
import { sectionData, StackShopLayoutParamList } from "../../utilities/Types";
import { useNavigation } from "expo-router";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";
import RadioGroup from "react-native-radio-buttons-group";
import { BE_addSection } from "../../backend/Queries";
import { SelectList } from "react-native-dropdown-select-list";
import { useStates } from "../../utilities/States";
import { StackScreenProps } from "@react-navigation/stack";
import { useDynamicStyles } from "../../utilities/Styles";
import ClickableBtn from "../../components/ClickableBtn";
import { useFocusEffect } from "@react-navigation/native";
import { LineChart } from "react-native-gifted-charts";
import SelectModal from "../../components/SelectModal";
import { MaterialIcons } from "@expo/vector-icons";
type Prop = StackScreenProps<StackShopLayoutParamList, "section">;
const Analytics: React.FC<Prop> = ({ navigation }) => {
  const styles2 = useDynamicStyles();
  const dispatch = useDispatch();
  const { appTheme, businessSections, businessId } = useStates();
  const businessData = businessSections;
  const [img, setImg] = useState("");
  const [Position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [layout, setLayout] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [salesAnalyticsTimeFrame, setSalesAnalyticsTimeFrame] = useState("");
  const [show, setShow] = useState(false);
  const [data, setData] = useState<{ key: number; value: string }[]>([]);
  const [d, setD] = useState<{ key: string; value: number }[]>([]);
  console.log(salesAnalyticsTimeFrame, "sales in fo tinme frame");
  const ptData = [
    { value: 160, date: "1 Apr 2022" },
    { value: 180, date: "2 Apr 2022" },
    { value: 190, date: "3 Apr 2022" },
    { value: 180, date: "4 Apr 2022" },
    { value: 140, date: "5 Apr 2022" },
    { value: 145, date: "6 Apr 2022" },
    { value: 160, date: "7 Apr 2022" },
    { value: 200, date: "8 Apr 2022" },

    { value: 220, date: "9 Apr 2022" },
    {
      value: 240,
      date: "10 Apr 2022",
      label: "10 Apr",
      labelTextStyle: { color: "lightgray", width: 60 },
    },
    { value: 280, date: "11 Apr 2022" },
    { value: 260, date: "12 Apr 2022" },
    { value: 340, date: "13 Apr 2022" },
    { value: 385, date: "14 Apr 2022" },
    { value: 280, date: "15 Apr 2022" },
    { value: 390, date: "16 Apr 2022" },

    { value: 370, date: "17 Apr 2022" },
    { value: 285, date: "18 Apr 2022" },
    { value: 295, date: "19 Apr 2022" },
    {
      value: 300,
      date: "20 Apr 2022",
      label: "20 Apr",
      labelTextStyle: { color: "lightgray", width: 60 },
    },
    { value: 280, date: "21 Apr 2022" },
    { value: 295, date: "22 Apr 2022" },
    { value: 260, date: "23 Apr 2022" },
    { value: 255, date: "24 Apr 2022" },

    { value: 190, date: "25 Apr 2022" },
    { value: 220, date: "26 Apr 2022" },
    { value: 205, date: "27 Apr 2022" },
    { value: 230, date: "28 Apr 2022" },
    { value: 210, date: "29 Apr 2022" },
    {
      value: 200,
      date: "30 Apr 2022",
      label: "30 Apr",
      labelTextStyle: { color: "lightgray", width: 60 },
    },
    { value: 240, date: "1 May 2022" },
    { value: 250, date: "2 May 2022" },
    { value: 280, date: "3 May 2022" },
    { value: 250, date: "4 May 2022" },
    { value: 210, date: "5 May 2022" },
  ];

  useFocusEffect(
    useCallback(() => {
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

      return () => {
        setData([]);
        setD([]);
      };
    }, [businessData])
  );

  const createRandomId = useCallback(() => {
    return Math.random().toString(36).substring(2, 27);
  }, []);

  const handleSubmit = () => {
    console.log(d.length < 1);
    const r =
      d.length < 1
        ? [0]
        : d.filter((item) => item.key === Position).map((item) => item.value);

    let num = r[0];
    if (num !== undefined || num === 0) {
      const sectionData: sectionData = {
        id: createRandomId(),
        name: title,
        postion: num,
        businessid: businessId,
        type: "Section",
        layout: layout,
        valid: true,
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
    navigation.popTo("home");
  };
  const radioButtons = useMemo(
    () => [
      {
        id: "grid",
        label: "Grid",
        value: "grid",
      },
      {
        id: "row",
        label: "Row",
        value: "row",
      },
    ],
    []
  );

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
  console.log(layout === "row");
  const styles = StyleSheet.create({
    cont: {
      backgroundColor: appTheme.colors?.primary,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 9,
    },
  });
  return (
    <View
      style={{ backgroundColor: appTheme.colors?.background }}
      className="w-full h-full  "
    >
      <View
        style={{ backgroundColor: appTheme.colors?.primary }}
        className="p-[5%] "
      >
        <Text style={styles2.text} className={`text-[24px] `}>
          Analytics
        </Text>
      </View>
      <ScrollView>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%]"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text
                style={styles2.text}
                className="text-[19px] items-center  border-bg -top-1 font-semibold"
              >
                Store Sales
              </Text>
            </View>
            <View>
              <SelectModal
                onSelection={setSalesAnalyticsTimeFrame}
                data={["Last 7 days ", "Last 14 days ", "Last 3 Months "]}
              />
            </View>
          </View>
          <View
            style={{ borderColor: appTheme.colors?.background, borderWidth: 2 }}
            className=" mt-5  rounded-sm p-2 flex-row flex-wrap"
          >
            <View
              style={{
                borderColor: appTheme.colors?.background,
                borderRightWidth: 2,
              }}
              className="  p-2  w-[170px]"
            >
              <Text style={styles2.text} className="text-[11px]">
                Orders Processed
              </Text>
              <View>
                <View className="left-3 flex-row items-center gap-2">
                  <Text
                    style={styles2.text}
                    className="text-[30px] border border-transparent "
                  >
                    25
                  </Text>
                  <View className="flex-row">
                    <MaterialIcons
                      name="trending-up"
                      size={19}
                      color={"green"}
                    />
                    <Text
                      style={{
                        fontFamily: styles2.text.fontFamily,
                        color: "green",
                      }}
                      className="text-[12px]"
                    >
                      13%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{}} className="  p-2  left-3  w-[170px]">
              <Text style={styles2.text} className="text-[11px]">
                Revenue
              </Text>
              <View>
                <View className="left-3 flex-row items-center gap-2">
                  <Text
                    style={styles2.text}
                    className="text-[30px] border border-transparent "
                  >
                    R465<Text className="text-[15px]">.12</Text>
                  </Text>
                  <View className="flex-row">
                    <MaterialIcons
                      name="trending-down"
                      size={19}
                      color={"red"}
                    />
                    <Text
                      style={{
                        fontFamily: styles2.text.fontFamily,
                        color: "red",
                      }}
                      className="text-[12px]"
                    >
                      5.3%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                borderColor: appTheme.colors?.background,
                borderRightWidth: 2,
                borderTopWidth: 2,
              }}
              className="  p-2  w-[170px]"
            >
              <Text style={styles2.text} className="text-[11px]">
                Products in store
              </Text>
              <View>
                <View className="left-3 flex-row items-center gap-2">
                  <Text
                    style={styles2.text}
                    className="text-[30px] border border-transparent "
                  >
                    55
                  </Text>
                  <View className="flex-row">
                    <MaterialIcons
                      name="trending-down"
                      size={19}
                      color={"red"}
                    />
                    <Text
                      style={{
                        fontFamily: styles2.text.fontFamily,
                        color: "red",
                      }}
                      className="text-[12px]"
                    >
                      5.4%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                borderColor: appTheme.colors?.background,

                borderTopWidth: 2,
              }}
              className="   p-2 px-5 w-[170px]"
            >
              <Text style={styles2.text} className="text-[11px]">
                Products in store
              </Text>
              <View>
                <View className="left-3 flex-row items-center gap-2">
                  <Text
                    style={styles2.text}
                    className="text-[30px] border border-transparent "
                  >
                    55
                  </Text>
                  <View className="flex-row">
                    <MaterialIcons
                      name="trending-down"
                      size={19}
                      color={"red"}
                    />
                    <Text
                      style={{
                        fontFamily: styles2.text.fontFamily,
                        color: "red",
                      }}
                      className="text-[12px]"
                    >
                      5.4%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%] mt-2 "
        >
          <View>
            <Text style={styles2.text} className="text-[18px] font-semibold">
              Section Layout
            </Text>
          </View>
          <View className="mt-[5%]">
            <RadioGroup
              layout="row"
              labelStyle={{
                color: appTheme.colors?.textColor,
                fontSize: 18,
                fontWeight: "bold",
              }}
              radioButtons={radioButtons}
              onPress={(s) => {
                setLayout(s);
              }}
              selectedId={layout}
            />
          </View>
        </View>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%] mt-2 "
        >
          <View>
            <Text style={styles2.text} className="text-[18px] font-semibold">
              Layout Preview
            </Text>
          </View>
          <View>
            <View
              className={`h-fit w-[250px]  justify-center  p-5`}
              style={styles.cont}
            >
              {layout === "grid" ? (
                <>
                  <View
                    style={{ backgroundColor: appTheme.colors?.secondary }}
                    className="w-[80px] h-[80px] rounded-md "
                  />
                  <View
                    style={{
                      backgroundColor: appTheme.colors?.quaternary,
                    }}
                    className="w-[80px] h-[80px] rounded-md"
                  />
                  <View
                    style={{
                      backgroundColor: appTheme.colors?.background,
                    }}
                    className="w-[80px] h-[80px] rounded-md"
                  />
                  <View
                    style={{
                      backgroundColor: appTheme.colors?.textColor,
                    }}
                    className="w-[80px] h-[80px] rounded-md"
                  />
                </>
              ) : (
                <>
                  <ScrollView horizontal>
                    <View
                      style={{ backgroundColor: appTheme.colors?.secondary }}
                      className="w-[80px] h-[80px] rounded-md m-2 "
                    />
                    <View
                      style={{
                        backgroundColor: appTheme.colors?.quaternary,
                      }}
                      className="w-[80px] h-[80px] rounded-md  m-2 "
                    />
                    <View
                      style={{
                        backgroundColor: appTheme.colors?.background,
                      }}
                      className="w-[80px] h-[80px] rounded-md  m-2 "
                    />
                    <View
                      style={{
                        backgroundColor: appTheme.colors?.textColor,
                      }}
                      className="w-[80px] h-[80px] rounded-md  m-2 "
                    />
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </View>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%] mt-2 "
        >
          <View>
            <Text style={styles2.text} className="text-[18px] font-semibold">
              Position
            </Text>
          </View>
          <View className="mt-[5%]">
            <SelectList
              setSelected={(val: string) => setPosition(val)}
              data={data.length > 0 ? data : [{ key: 0, value: "First" }]}
              save="value"
              inputStyles={styles2.text}
              dropdownTextStyles={styles2.text}
              placeholder="Position"
              search={false}
            />
          </View>
        </View>
        <View className="p-[5%]  justify-between  flex-row">
          <ClickableBtn title="Save" onPress={handleSubmit} width={120} />
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
};
export default memo(Analytics);
