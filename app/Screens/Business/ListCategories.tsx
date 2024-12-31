import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import {
  category,
  sectionData,
  StackShopLayoutParamList,
} from "../../utilities/Types";
import {
  BE_addCategory,
  BE_delC,
  BE_saveCategory,
  getUid,
} from "../../backend/Queries";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import ClickableBtn from "../../components/ClickableBtn";

type Prop = StackScreenProps<StackShopLayoutParamList, "categoryList">;

const ListCategories: React.FC<Prop> = memo(({ navigation, route }) => {
  const styles = useDynamicStyles();
  const { businessState, appTheme, CategoryListState } = useStates();
  const dispatch = useDispatch();
  const businessData = businessState.userBusiness.sections;
  console.log("catetrory list called");

  const [data, setData] = useState<{ key: number; value: string }[]>([]);
  const [d, setD] = useState<{ key: string; value: number }[]>([]);
  const [categories, setCategories] = useState<(category | undefined)[]>([]);
  const [img, setImg] = useState("");
  const [position, setPosition] = useState("");
  const [title, setTitle] = useState("");

  // Function to create a random ID
  const createRandomId = useCallback(() => {
    return Math.random().toString(36).substring(2, 27);
  }, []);

  // Initialize data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      // Prepare data for SelectList
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

      // Filter categories
      const filteredCategories = CategoryListState.SectionList.filter(
        (section) => !section.valid
      ).flatMap((section) => section.categoryList?.categories || []);

      setCategories(filteredCategories);

      // Check for existing unsaved section
      let section = CategoryListState.SectionList.find((sec) => !sec.valid);
      console.log("cat list section : ", section);

      if (!section) {
        const id = createRandomId();
        const newSection: sectionData = {
          name: "New Section",
          type: "categories",
          valid: false,
          categoryList: { saved: false, id, categories: [] },
          postion: 0,
        };
        BE_addCategory({ dispatch, sectionInfo: newSection, id });
      }

      // Cleanup function when screen is unfocused
      return () => {
        // Optionally reset state if needed
        // setData([]);
        // setD([]);
        // setCategories([]);
      };
    }, [businessData, CategoryListState.SectionList, dispatch, createRandomId])
  );

  // Handle saving the category
  const handleSave = useCallback(() => {
    const id = getUid();
    BE_saveCategory(
      { id }, // Assuming category requires an ID; adjust as needed
      dispatch,
      title,
      Number(position),
      navigation
    );
    navigation.navigate("home");
  }, [dispatch, navigation, title, position]);

  // Handle deleting a category
  const handleDeleteCategory = useCallback(
    (item: category) => {
      BE_delC(item, dispatch);
    },
    [dispatch]
  );

  // Render item for FlatList
  const renderItemCategory = useCallback(
    ({ item }: { item: category }) => (
      <View
        style={{
          borderColor: appTheme.colors?.textColor,
          borderWidth: 1,
          borderRadius: 2,
        }}
        className="mt-3 p-1 flex-row items-center gap-5"
      >
        <Image
          source={{ uri: item?.img }}
          className="rounded-sm"
          style={{ width: 30, height: 30 }}
        />
        <Text className="text-[14px] font-semibold" style={styles.text}>
          {item?.name}
        </Text>
        <AntDesign
          size={20}
          style={{ color: appTheme.colors?.textColor }}
          name="delete"
          onPress={() => handleDeleteCategory(item!!)}
        />
      </View>
    ),
    [appTheme.colors?.textColor, handleDeleteCategory, styles.text]
  );

  return (
    <View className="w-full h-full">
      <View style={styles.sections} className="">
        <Text style={styles.text} className="text-[24px]">
          Add Categories
        </Text>
      </View>
      <ScrollView>
        {/* Add Categories Title */}

        {/* Title Input */}
        <View style={styles.sections} className="mt-1">
          <Text style={styles.text} className="text-[18px] font-semibold">
            Title
          </Text>
          <TextInput
            placeholder="Category Title"
            placeholderTextColor={appTheme.colors?.textColor}
            value={title}
            onChangeText={setTitle}
            style={styles.inputs}
            className="rounded-sm py-3 w-[70%]"
          />
        </View>

        {/* Add Category Button */}
        <View style={styles.sections} className="mt-1">
          <TouchableNativeFeedback
            onPress={() => {
              navigation.navigate("category", { id: getUid() });
            }}
          >
            <View
              className="bg-transparent rounded-md p-2 w-[120px]"
              style={{
                borderColor: appTheme.colors?.textColor,
                borderWidth: 2,
              }}
            >
              <Text style={styles.text} className="font-semibold text-center">
                Add category
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        {/* Category List */}
        <View style={styles.sections} className="mt-1">
          <Text style={styles.text} className="text-[18px] font-semibold">
            Category List
          </Text>
          <View
            style={{
              backgroundColor: appTheme.colors?.background,
              height: 180,
              marginTop: 20,
              width: "75%",
            }}
          >
            <FlatList
              nestedScrollEnabled={true}
              data={categories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItemCategory}
            />
          </View>
        </View>

        {/* Position Selector */}
        <View style={styles.sections} className="mt-1">
          <Text style={styles.text} className="text-[18px] font-semibold">
            Position
          </Text>
          <View className="mt-[5%]">
            <SelectList
              setSelected={setPosition}
              data={data.length > 0 ? data : [{ key: 0, value: "First" }]}
              save="key"
              inputStyles={styles.text}
              dropdownTextStyles={styles.text}
              placeholder="Position"
              search={false}
            />
          </View>
        </View>

        {/* Save Button */}
        <View className="p-[5%]">
          <ClickableBtn title="Save" width={140} onPress={handleSave} />
        </View>
      </ScrollView>
    </View>
  );
});

export default ListCategories;
