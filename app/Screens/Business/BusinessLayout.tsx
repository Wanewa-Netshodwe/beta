import {
  View,
  Text,
  TouchableNativeFeedback,
  Switch,
  ScrollView,
  FlatList,
  RefreshControl,
  ImageBackground,
  Image,
} from "react-native";
import * as Font from "expo-font";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

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
import { removeForeground } from "../../redux/businessSlice";

type prop = StackScreenProps<StackShopLayoutParamList, "home">;
const BusinessLayout: React.FC<prop> = ({ navigation }) => {
  const styles = useDynamicStyles();
  const handleDeleteSection = (sectionInfo: sectionData) => {
    BE_deleteSection({ dispatch, sectionInfo });
  };
  const [isLoading, setLoading] = useState(false);
  const { width } = Dimensions.get("screen");
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
  // const [loaded] = Font.useFonts({
  //   font: fontMap[font], // Map Redux font name to the correct font file
  // });
  const [selectedFont, setSelectedFont] = useState(
    appTheme.fonts?.primary || ""
  );
  const [isFontLoaded, setIsFontLoaded] = useState(true);
  const loadFont = async (fontName: string) => {
    if (fontMap[fontName]) {
      setIsFontLoaded(false); // Set loading state
      await Font.loadAsync({ [fontName]: fontMap[fontName] });
      setIsFontLoaded(true); // Set font loaded
    }
  };
  useEffect(() => {
    if (selectedFont) {
      loadFont(selectedFont);
      setLoading(true);
    }
  }, [selectedFont]);

  console.log("selected fonts :", font);
  const dispatch = useDispatch();
  console.log("font loaded :", isLoading, " the font is : ", font);

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

  console.log("app theme : ", appTheme);
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View
          style={{
            backgroundColor: appTheme.colors?.background,

            // borderColor:'green',
            // borderWidth:1,
            height: "100%",
          }}
        >
          <ScrollView
            style={{ height: "100%" }}
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
            {BusinessInfo.foregroundImg ? (
              <>
                <ImageBackground
                  source={{ uri: BusinessInfo.foregroundImg }}
                  resizeMethod="resize"
                  style={{ height: 180 }}
                  width={width}
                  className="relative"
                >
                  <AntDesign
                    onPress={() => {
                      dispatch(removeForeground());
                    }}
                    size={25}
                    style={{ color: appTheme.colors!!.quaternary }}
                    className="absolute z-40 left-[280px] top-[28px] "
                    name="delete"
                  />
                  <View className="p-[5%] mt-3  h-fit">
                    <LoadingComp
                      loaded={isLoading}
                      item={
                        <View className="flex-row gap-2 ">
                          <Image
                            style={{
                              borderRadius: 5,
                              borderColor: appTheme.colors?.secondary,
                              borderWidth: 1,
                            }}
                            resizeMethod="resize"
                            resizeMode="cover"
                            source={{ uri: BusinessInfo.store_pic }}
                            height={35}
                            width={35}
                          />
                          <View className=" flex-row gap-2 items-center">
                            <Text
                              style={[
                                styles.text,
                                { borderColor: "transparent", borderWidth: 1 },
                              ]}
                              className={`text-[22px] h-fit   `}
                            >
                              {editmode
                                ? "Shop Layout"
                                : BusinessInfo.store_name}
                            </Text>
                            {!editmode && (
                              <>
                                {BusinessInfo.verified && (
                                  <MaterialIcons
                                    name="verified"
                                    size={25}
                                    color={appTheme.colors?.primary}
                                  />
                                )}
                              </>
                            )}
                          </View>
                        </View>
                      }
                    />
                    {editmode && (
                      <View className="flex-row items-center gap-1 mt-[2%] ">
                        {isLoading ? (
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
                        {isLoading ? (
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

                    {!editmode && (
                      <SearchBar className=" absolute top-4 elevation-sm" />
                    )}
                  </View>
                </ImageBackground>
              </>
            ) : (
              <>
                <View className="p-[5%]  h-fit">
                  <LoadingComp
                    loaded={isLoading}
                    item={
                      <Text
                        style={styles.text}
                        className={`text-[24px] h-fit  `}
                      >
                        Shop Layout
                      </Text>
                    }
                  />
                  {editmode && (
                    <View className="flex-row items-center gap-1 mt-[2%] ">
                      {isLoading ? (
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
                      {isLoading ? (
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
              </>
            )}

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
                            style={{ color: appTheme.colors?.textColor }}
                            className="absolute z-40 left-[200px] top-[37px] "
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
                className=" self-center rounded-full  w-8 h-8 items-center mt-[5%]"
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
            <View className="h-[50px]"></View>
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
                  title="Foreground Image"
                  onPress={() => {
                    navigation.navigate("foregroundImg");
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
