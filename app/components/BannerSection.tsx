import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { sectionData } from "../utilities/Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { BE_deleteSection } from "../backend/Queries";

type Props = {
  editmode?: boolean;
  item: sectionData;
};

const BannerSection = ({ item, editmode }: Props) => {
  const dispatch = useDispatch();
  const handleDeleteSection = (sectionInfo: sectionData) => {
    BE_deleteSection({ dispatch, sectionInfo });
  };
  const { width } = Dimensions.get("screen");
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  return (
    <View
      className=" mt-1 relative"
      style={{
        backgroundColor: appTheme.colors!!.primary,
        height: item.height!! + 10,
      }}
    >
      <Image
        style={{ marginTop: 5 }}
        width={width}
        height={item.height}
        source={{ uri: item.imgs!![0] }}
      />
      {editmode ? (
        <AntDesign
          onPress={() => handleDeleteSection(item)}
          size={30}
          style={{ color: appTheme.colors!!.primary }}
          className="absolute z-40 right-5 top-3 "
          name="delete"
        />
      ) : null}
      {editmode ? (
        <Text
          style={{ color: appTheme.colors!!.primary }}
          className="absolute text-[18px] font-bold  z-40 left-1 top-6"
        >
          {item.name}
        </Text>
      ) : null}
    </View>
  );
};

export default BannerSection;
