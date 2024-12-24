import { View, Text, Image } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type Props = {
  img: string;
  name: string;
};

const CategoryView = (props: Props) => {
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  return (
    <View className="w-[110px]  gap-2 mt-2 items-center">
      <Image
        width={50}
        height={50}
        style={{ borderRadius: 990 }}
        source={{ uri: props.img }}
      />
      <Text
        style={{ color: appTheme.colors!!.tertiary, width:90 }}
        className="font-semibold text-center text-[13px] "
      >
        {props.name}
      </Text>
    </View>
  );
};

export default CategoryView;
