import { View, Text, Dimensions, Image } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { BE_deleteSection } from "../backend/Queries";
import { sectionData } from "../utilities/Types";
import Carousel from "react-native-reanimated-carousel";
import { RootState } from "../redux/store";

type Props = {
  editmode?: boolean;
  item: sectionData;
};

const CarouselSection = ({ item, editmode }: Props) => {
  const { width } = Dimensions.get("screen");
  const dispatch = useDispatch();
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  const handleDeleteSection = (sectionInfo: sectionData) => {
    BE_deleteSection({ dispatch, sectionInfo });
  };
  return (
    <View
      className=" mt-2 relative"
      style={{
        backgroundColor: appTheme.colors!!.secondary,
        height: item.height!! + 20,
      }}
    >
      {editmode ? (
        <AntDesign
          onPress={() => handleDeleteSection(item)}
          size={30}
          style={{ color: appTheme.colors!!.secondary }}
          className="absolute z-40 right-5 top-4 "
          name="delete"
        />
      ) : null}
      {editmode ? (
        <Text
          style={{ color: appTheme.colors!!.quaternary }}
          className="absolute text-[18px] font-bold  z-40 left-2 top-6"
        >
          {item.name}
        </Text>
      ) : null}
      <Carousel
        loop={true}
        {...(item.properties?.carouselType === "vertical"
          ? { vertical: true }
          : {})}
        autoPlayInterval={item.properties?.carouselSpeed}
        style={{ marginTop: 10 }}
        width={width}
        height={item.height!!}
        data={item.imgs!!}
        autoPlay={true}
        scrollAnimationDuration={item.properties?.carouselSpeed}
        renderItem={(it) => (
          <Image
            height={item.height!!}
            width={width}
            source={{ uri: it.item }}
          />
        )}
      />
    </View>
  );
};

export default CarouselSection;
