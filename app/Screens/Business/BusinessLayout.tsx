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
  ListRenderItemInfo,
} from "react-native";
import * as Font from "expo-font";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MySection from "../../components/MySection";
import { Dimensions } from "react-native";
import {
  StackShopLayoutParamList,
  category,
  sectionData,
} from "../../utilities/Types";
import { BE_deleteSection, BE_PublishStore } from "../../backend/Queries";
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
import { useStates } from "../../utilities/States";
import { RootState } from "../../redux/store";
import OutlineBtn from "../../components/OutlineBtn";

type prop = StackScreenProps<StackShopLayoutParamList, "home">;
const BusinessLayout: React.FC<prop> = ({ navigation }) => {
  const sections = useSelector(
    (state: RootState) => state.business.userBusiness.sections,
    shallowEqual
  );
  const Businessforeground = useSelector(
    (state: RootState) => state.business.userBusiness.foregroundImg
  );
  const store_pic = useSelector(
    (state: RootState) => state.business.userBusiness.store_pic
  );
  const store_name = useSelector(
    (state: RootState) => state.business.userBusiness.store_name
  );
  const verified = useSelector(
    (state: RootState) => state.business.userBusiness.verified
  );
  const styles = useDynamicStyles();
  const { appTheme } = useStates();
  const handleDeleteSection = (sectionInfo: sectionData) => {
    BE_deleteSection({ dispatch, sectionInfo });
  };
  const [isLoading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { width } = Dimensions.get("screen");
  const font = appTheme.fonts?.primary;
  const { businessState } = useStates();
  console.log("business layout screen called");
  console.log("business state :", businessState.userBusiness);
  const [selectedFont, setSelectedFont] = useState(
    appTheme.fonts?.primary || ""
  );
  const renderItemCategory = useCallback(
    ({ item }: { item: category }) => (
      <CategoryView name={item.name!!} img={item.img!!} />
    ),
    []
  );

  const loadFont = async (fontName: string) => {
    if (fontMap[fontName]) {
      await Font.loadAsync({ [fontName]: fontMap[fontName] });
    }
  };
  console.log("sections : log : ", sections);
  useEffect(() => {
    if (selectedFont) {
      loadFont(selectedFont);
      setLoading(true);
    }
  }, [selectedFont]);
  const dispatch = useDispatch();
  const [editmode, setEditMode] = useState(true);
  const bottomSheetModalRef = useRef(null);
  const handlePresentModalPress = useCallback(() => {
    //@ts-ignore
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<sectionData>) => {
      if (item.type === "Banner" && item.imgs && item.height) {
        return <BannerSection item={item} editmode={editmode} />;
      }
      if (item.type === "Carousel" && item.imgs && item.height) {
        return <CarouselSection editmode={editmode} item={item} />;
      }
      if (item.type === "Section") {
        return (
          <View className="relative">
            {editmode && (
              <AntDesign
                onPress={() => handleDeleteSection(item)}
                size={20}
                style={{ color: appTheme.colors?.textColor }}
                className="absolute z-40 left-[200px] top-[37px]"
                name="delete"
              />
            )}
            <MySection
              edit={editmode}
              name={item.name}
              section={item}
              products={item.products ? item.products : undefined}
              nav={navigation}
            />
          </View>
        );
      }
      if (item.type === "categories") {
        return (
          <View
            style={{
              backgroundColor: appTheme.colors!!.primary,
              height: 148,
            }}
            className="px-5 mt-2"
          >
            <View className="flex-row items-center mt-2">
              <Text className="text-[25px] w-[80%]" style={styles.text}>
                {item.name}
              </Text>
            </View>
            <FlatList
              horizontal
              data={item.categoryList?.categories}
              keyExtractor={(item) => item.name!!.toString()}
              renderItem={renderItemCategory}
            />
          </View>
        );
      }
      return null;
    },
    []
  );

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View
          style={{
            backgroundColor: appTheme.colors?.background,
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
            {Businessforeground ? (
              <>
                <ImageBackground
                  source={{ uri: Businessforeground }}
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
                            source={{ uri: store_pic }}
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
                              {editmode ? "Shop Layout" : store_name}
                            </Text>
                            {!editmode && (
                              <>
                                {verified && (
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
                      <SearchBar
                        nav={navigation}
                        className=" absolute top-4 elevation-sm"
                      />
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

                  {!editmode && <SearchBar nav={navigation} />}
                </View>
              </>
            )}

            {sections.length > 0 && (
              <FlatList
                data={sections}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
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

                <OutlineBtn
                  onPress={() => {
                    BE_PublishStore(businessState.userBusiness);
                  }}
                  title="publish store"
                ></OutlineBtn>
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
export default memo(BusinessLayout);
