import {
  View,
  Text,
  TouchableNativeFeedback,
  Switch,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import * as Font from "expo-font";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Screen from "../../utilities/Screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MySection from "../../components/MySection";
import { Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { StackShopLayoutParamList, sectionData } from "../../utilities/Types";
import { BE_deleteSection } from "../../backend/Queries";
import { useNavigation } from "expo-router";
import { StackScreenProps } from "@react-navigation/stack";
import CategoryView from "../../components/CatogoryView";
import { TextLoader } from "../../utilities/Loaders";
import fontMap from "../../utilities/fontMap";
import SearchBar from "../../components/SearchBar";
import ClickableBtn from "../../components/ClickableBtn";
import BannerSection from "../../components/BannerSection";
import CarouselSection from "../../components/CarouselSection";
import { useDynamicStyles } from "../../utilities/Styles";
import LoadingComp from "../../utilities/LoadingComp";

type prop = StackScreenProps<StackShopLayoutParamList, "home">;
const BusinessLayout: React.FC<prop> = ({ navigation }) => {
  const styles = useDynamicStyles();
  const handleDeleteSection = (sectionInfo: sectionData) => {
    BE_deleteSection({ dispatch, sectionInfo });
  };
  const [isLoading, setLoading] = useState(false);
  const { width } = Dimensions.get("window");
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  const font = useSelector(
    (state: RootState) => state.appTheme.appTheme.fonts!!.primary
  );
  console.log("font in redux : ", font);

  const BusinessInfo = useSelector(
    (state: RootState) => state.business.userBusiness
  );
  // console.log(fontMap[font]);
  // useEffect(() => {

  //   setLoading(loaded);
  // }, [font]);
  const [loaded] = Font.useFonts({
    font: fontMap[font], // Map Redux font name to the correct font file
  });

  console.log("selected fonts :", font);
  const dispatch = useDispatch();

  // console.log("business :", BusinessInfo);
  console.log("business :", BusinessInfo.sections);
  const [editmode, setEditMode] = useState(true);
  const bottomSheetModalRef = useRef(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View
          style={{ backgroundColor: appTheme.colors?.background }}
          className=" h-full relative "
        >
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={false}
                colors={[
                  appTheme.colors?.secondary!!,
                  appTheme.colors?.primary!!,
                ]}
              />
            }
          >
            <View className="p-[5%]  h-fit">
              <LoadingComp
                loaded={loaded}
                item={
                  <Text style={styles.text} className={`text-[24px] h-fit  `}>
                    Shop Layout
                  </Text>
                }
              />
              {editmode && (
                <View className="flex-row items-center gap-1 mt-[2%] ">
                  {loaded ? (
                    <Text
                      style={styles.text}
                      className=" w-[14%] font-bold text-[11px] "
                    >
                      Preview
                    </Text>
                  ) : (
                    <TextLoader width={"Preview".length} />
                  )}

                  <Switch
                    value={editmode}
                    onValueChange={(b) => {
                      setEditMode(b);
                    }}
                  ></Switch>
                  {loaded ? (
                    <Text
                      style={styles.text}
                      className=" w-[14%] font-bold text-[11px] "
                    >
                      Edit
                    </Text>
                  ) : (
                    <TextLoader width={"Edit".length} />
                  )}
                </View>
              )}

              {!editmode && <SearchBar />}
            </View>

            {BusinessInfo.sections.length > 0 && (
              <FlatList
                data={BusinessInfo.sections}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                  if (item.type === "Banner" && item.imgs && item.height) {
                    return <BannerSection item={item} editmode={editmode} />;
                  }

                  if (item.type === "Carousel" && item.imgs && item.height) {
                    return <CarouselSection editmode={editmode} item={item} />;
                  }

                  if (item.type === "Section") {
                    console.log("products : ", item.products);
                    return (
                      <View className="relative ">
                        {editmode && (
                          <AntDesign
                            onPress={() => handleDeleteSection(item)}
                            size={20}
                            style={{ color: appTheme.colors!!.tertiary }}
                            className="absolute z-40 left-[200px] top-[22px] "
                            name="delete"
                          />
                        )}

                        <MySection
                          name={item.name}
                          section={item}
                          products={item.products ? item.products : undefined}
                          nav={navigation}
                        />
                      </View>
                    );
                  }
                  if (item.type === "categories") {
                    console.log("products : ", item.categoryList);
                    return (
                      <View
                        style={{
                          backgroundColor: appTheme.colors!!.secondary,
                          height: 128,
                        }}
                        className="px-5  mt-2"
                      >
                        <View className="flex-row items-center mt-2">
                          <Text
                            className="font-bold text-[25px] w-[80%]"
                            style={{ color: appTheme.colors!!.tertiary }}
                          >
                            {item.name}
                          </Text>
                        </View>
                        <FlatList
                          horizontal
                          data={item.categoryList?.categories}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <CategoryView name={item.name!!} img={item.img!!} />
                          )}
                        />
                      </View>
                    );
                  }

                  return null;
                }}
              />
            )}

            <TouchableNativeFeedback onPress={handlePresentModalPress}>
              <View
                style={{ backgroundColor: appTheme.colors!!.tertiary }}
                className=" self-center rounded-full  w-8 h-8 items-center mt-[8%]"
              >
                <Text
                  style={styles.text}
                  className="text-center font-bold text-[20px]"
                >
                  +
                </Text>
              </View>
            </TouchableNativeFeedback>
            {!editmode && (
              <View className="flex-row items-center gap-1 mt-[2%] ">
                <Text
                  style={styles.text}
                  className=" w-[14%] font-bold text-[11px] "
                >
                  Preview
                </Text>

                <Switch
                  value={editmode}
                  onValueChange={(b) => {
                    setEditMode(b);
                  }}
                ></Switch>
                <Text
                  style={styles.text}
                  className=" w-[11%] font-bold text-[11px]"
                >
                  Edit
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <BottomSheetModal
          backgroundStyle={{ backgroundColor: appTheme.colors!!.secondary }}
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          snapPoints={["45%", "45%"]} // Adjust the snap points as needed
        >
          <BottomSheetView className="w-full h-full">
            <Text
              className="font-bold text-[19px] text-center"
              style={{ color: appTheme.colors!!.tertiary, fontFamily: font }}
            >
              Select one of the following options
            </Text>
            <View className="justify-center">
              <ScrollView
                contentContainerStyle={{ alignItems: "center", gap: 2 }}
                className="w-full h-full  "
              >
                <ClickableBtn
                  title="Banner"
                  onPress={() => {
                    navigation.navigate("banner");
                  }}
                />
                <ClickableBtn
                  title="Carousel"
                  onPress={() => {
                    navigation.navigate("carousel");
                  }}
                />
                <ClickableBtn
                  title="Section"
                  onPress={() => {
                    navigation.navigate("section");
                  }}
                />
                <ClickableBtn
                  title="Categories"
                  onPress={() => {
                    navigation.navigate("categoryList");
                  }}
                />
              </ScrollView>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
export default BusinessLayout;
