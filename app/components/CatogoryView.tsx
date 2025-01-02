import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDynamicStyles } from "../utilities/Styles";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
  img: string;
  name: string;
};

const CategoryView = (props: Props) => {
  
  const { text } = useDynamicStyles();
  const [show, setshow] = useState(false);
  useFocusEffect(() => {
    setshow(true);
  });
  if (show) {
    return (
      <View className="w-[110px] p-[5%]  gap-2 mt-2 items-center">
        <Image
          width={50}
          height={50}
          style={{ borderRadius: 990 }}
          source={{ uri: props.img }}
        />
        <Text style={text} className="font-semibold text-center text-[13px] ">
          {props.name}
        </Text>
      </View>
    );
  }
};

export default CategoryView;
