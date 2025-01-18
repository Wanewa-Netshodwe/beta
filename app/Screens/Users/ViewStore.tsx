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

import { Dimensions } from "react-native";
import {
  BusinessAccount,
  StackShopLayoutParamList,
  StackStoreListParamList,
  category,
  sectionData,
} from "../../utilities/Types";
import {
  BE_deleteSection,
  BE_getAllBusinesses,
  BE_PublishStore,
  getBusinessInfo,
} from "../../backend/Queries";
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
import { getUserBusiness, RootState } from "../../redux/store";
import OutlineBtn from "../../components/OutlineBtn";
import MySectionStore from "../../components/MySectionStore";
import { useSharedValue } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { createAnayltic, updateAnayltic } from "../../utilities/UserAnayltics";
import { setCurrentScreen } from "../../redux/ScreenSlice";
import { setLastVisted } from "../../redux/analytics";

type prop = StackScreenProps<StackStoreListParamList, "viewStore">;

const ViewStore: React.FC<prop> = ({ navigation, route }) => {
  let Focused = useSharedValue(false);
  const businessData = route.params.business;
  const sections = businessData.sections;
  const Businessforeground = businessData.foregroundImg;
  const store_pic = businessData.store_pic;
  const store_name = businessData.store_name;
  const verified = businessData.verified;
  const styles = useDynamicStyles();
  const { appTheme, current_screen } = useStates();
  const handleDeleteSection = (sectionInfo: sectionData) => {
    BE_deleteSection({ dispatch, sectionInfo });
  };
  const [isLoading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { width } = Dimensions.get("screen");
  const font = appTheme.fonts?.primary;
  console.log("store view screen called");
  console.log(businessData);
  const [selectedFont, setSelectedFont] = useState(
    appTheme.fonts?.primary || ""
  );
  const renderItemCategory = useCallback(
    ({ item }: { item: category }) => (
      <CategoryView name={item.name!!} img={item.img!!} />
    ),
    []
  );
  useEffect(() => {
    Focused.value = false;
  }, []);
  useEffect(() => {
    if (current_screen === "StoreList") {
      dispatch(setLastVisted(businessData.id));
      createAnayltic(businessData.id, dispatch);
      dispatch(setCurrentScreen("ViewStore"));
    } else if (current_screen === "ViewProduct") {
      updateAnayltic(businessData.id, "ViewStore");
      dispatch(setCurrentScreen("ViewStore"));
    }
  }, []);

  console.log("useer is focused : ", Focused.value);
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

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<sectionData>) => {
      if (item.type === "Banner" && item.imgs && item.height) {
        return <BannerSection item={item} />;
      }
      if (item.type === "Carousel" && item.imgs && item.height) {
        return <CarouselSection item={item} />;
      }
      if (item.type === "Section") {
        return (
          <View className="relative">
            <MySectionStore
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
  useFocusEffect(() => {});

  return (
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
            colors={[appTheme.colors?.secondary!!, appTheme.colors?.primary!!]}
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
                          {store_name}
                        </Text>
                      </View>
                    </View>
                  }
                />

                <SearchBar
                  nav={navigation}
                  className=" absolute top-4 elevation-sm"
                />
              </View>
            </ImageBackground>
          </>
        ) : (
          <>
            <View className="p-[5%]  h-fit">
              <LoadingComp
                loaded={isLoading}
                item={
                  <Text style={styles.text} className={`text-[24px] h-fit  `}>
                    {store_name}
                  </Text>
                }
              />

              <SearchBar nav={navigation} />
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

        <View className="h-[50px]"></View>
      </ScrollView>
    </View>
  );
};
export default memo(ViewStore);
