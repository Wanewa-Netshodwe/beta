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
import React, { useState, useMemo, useEffect } from "react";
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

import {
  BE_addCategory,
  BE_delC,
  BE_saveCategory,
  getUid,
} from "../../backend/Queries";
import { SelectList } from "react-native-dropdown-select-list";
import { StackScreenProps } from "@react-navigation/stack";
import { FlatList } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useStates } from "../../utilities/States";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { useDynamicStyles } from "../../utilities/Styles";
import ClickableBtn from "../../components/ClickableBtn";
type prop = StackScreenProps<StackShopLayoutParamList, "categoryList">;
const ListCategories: React.FC<prop> = ({ navigation }) => {
  const styles = useDynamicStyles();
  const { businessState, appTheme } = useStates();
  const business = businessState.userBusiness;
  let dataDummy: { key: string; index: number }[] | null =
    business.sections.length > 0 ? [] : null;
  business.sections.map((item, idx) => {
    if (item.valid)
      if (dataDummy) dataDummy.push({ key: item.name, index: idx });
  });
  let d: { key: string; value: number }[] = [];
  let data: { key: number; value: string }[] = [];
  dataDummy?.map((item) => {
    data.push({ key: item.index, value: "Before " + item.key });
    d.push({ key: "Before " + item.key, value: item.index });
  });
  dataDummy?.map((item) => {
    data.push({ key: item.index + 1, value: "After " + item.key });
    d.push({ key: "After " + item.key, value: item.index + 1 });
  });
  const handleDelCatogory = (item: category) => {
    BE_delC(item, dispatch);
  };
  const cat = business.sections
    .filter((section) => {
      if (section.type === "categories" && !section.valid) {
        console.log("found");
        return section.categoryList?.categories;
      }
    })
    .flatMap((section) => section.categoryList?.categories);
  console.log("categories : ", cat);
  console.log("sections : ", business.sections);
  console.log("sections length : ", business.sections.length);
  let id: string;

  useEffect(() => {
    // Find an existing unsaved section
    let section = business.sections.find(
      (sec) => sec.type === "categories" && !sec.valid
    );

    if (!section) {
      // If no unsaved section exists, create a new one
      const id = createRandomId();
      console.log("Created a new section with id:", id);
      const section: sectionData = {
        name: "kk",
        type: "categories",
        valid: false,
        categoryList: { saved: false, id, categories: [] },
        postion: 0,
      };
      BE_addCategory({ dispatch, sectionInfo: section, id });
    } else {
      id = section.categoryList?.id!!;
    }
  }, []);

  const createRandomId = () => {
    let str = "";
    for (let i = 0; i < 25; i++) {
      const s = String.fromCharCode(
        Math.ceil(65 + Math.random() * 25) // Uppercase letters
      );
      str += s;
    }
    return str;
  };

  const dispatch = useDispatch();

  const [img, setImg] = useState("");
  const [Position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const handleSubmit = () => {
    const category: category = {
      img: img,
      name: title,
    };
    // BE_addCategory({ id });
  };
  id = getUid();

  console.log("id : ", id);
  console.log("name :", title);
  const handleSave = () => {
    const category: category = {
      id: id,
    };

    BE_saveCategory(category, dispatch, title, Number(Position), navigation);
    navigation.navigate("home");
  };
  return (
    <View className="w-full h-full  ">
      <View style={styles.sections} className="">
        <Text style={styles.text} className={`text-[24px] `}>
          Add Categories
        </Text>
      </View>
      <ScrollView>
        <View style={styles.sections} className="mt-1">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Title
            </Text>
          </View>
          <View>
            <TextInput
              placeholder="Categories Titles"
              placeholderTextColor={appTheme.colors?.textColor}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
              style={styles.inputs}
              className=" rounded-sm py-3 w-[70%] "
            ></TextInput>
          </View>
        </View>
        <View style={styles.sections} className="mt-1">
          <View>
            <TouchableNativeFeedback
              onPress={() => {
                navigation.navigate("category", { id: id });
              }}
            >
              <View
                className="bg-transparent rounded-md p-2 w-[120px]"
                style={{
                  borderColor: appTheme.colors.tertiary,
                  borderWidth: 2,
                }}
              >
                <Text style={styles.text} className="font-semibold text-center">
                  Add category
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
        <View style={styles.sections} className="mt-1">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Category List
            </Text>
          </View>
          <View
            style={{
              backgroundColor: appTheme.colors?.background,
            }}
            className="  h-[180px] mt-[5%]  w-[75%] "
          >
            <FlatList
              nestedScrollEnabled={true}
              style={{ height: 180 }}
              data={cat}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    borderColor: appTheme.colors?.textColor,
                    borderWidth: 1,
                    borderRadius: 2,
                  }}
                  className="mt-3 p-1 flex-row items-center gap-5"
                >
                  <Image
                    width={30}
                    height={30}
                    source={{ uri: item?.img }}
                    className="rounded-sm"
                  ></Image>
                  <Text
                    className="text-[14px] font-semibold "
                    style={styles.text}
                  >
                    {item?.name}
                  </Text>
                  <AntDesign
                    size={20}
                    style={{ color: appTheme.colors?.textColor }}
                    name="delete"
                    onPress={() => {
                      handleDelCatogory(item!!);
                    }}
                  />
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.sections} className="mt-1">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Position
            </Text>
          </View>
          <View className="mt-[5%]">
            <SelectList
              setSelected={(val: string) => setPosition(val)}
              data={dataDummy ? data : [{ key: 0, value: "First" }]}
              save="value"
              inputStyles={styles.text}
              dropdownTextStyles={styles.text}
              placeholder="Position"
              search={false}
            />
          </View>
        </View>
        <View className=" p-[5%]">
          <ClickableBtn title="Save" width={140} onPress={handleSave} />
        </View>
      </ScrollView>
    </View>
  );
};
export default ListCategories;
