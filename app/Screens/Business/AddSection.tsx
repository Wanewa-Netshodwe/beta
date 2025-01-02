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
type Prop = StackScreenProps<StackShopLayoutParamList, "section">;
const AddSection: React.FC<Prop> = ({ navigation }) => {
  const styles2 = useDynamicStyles();
  const dispatch = useDispatch();
  const { appTheme, businessSections, businessId } = useStates();
  const businessData = businessSections;
  const [img, setImg] = useState("");
  const [Position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const [layout, setLayout] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<{ key: number; value: string }[]>([]);
  const [d, setD] = useState<{ key: string; value: number }[]>([]);
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
    <View style={{backgroundColor:appTheme.colors?.background}} className="w-full h-full  ">
      <View
        style={{ backgroundColor: appTheme.colors?.primary }}
        className="p-[5%] "
      >
        <Text style={styles2.text} className={`text-[24px] `}>
          Add Section
        </Text>
      </View>
      <ScrollView>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className=" mt-2 p-[5%]"
        >
          <View>
            <Text style={styles2.text} className="text-[18px] font-semibold">
              Title
            </Text>
          </View>
          <View className="">
            <TextInput
              placeholder="Section Title"
              placeholderTextColor={appTheme.colors?.textColor}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
              style={[
                {
                  backgroundColor: "transparent",
                  borderBottomColor: appTheme.colors?.background,
                  borderBottomWidth: 2,
                },
                styles2.text,
              ]}
              className=" rounded-sm py-3 w-[70%] "
            ></TextInput>
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
export default memo(AddSection);
