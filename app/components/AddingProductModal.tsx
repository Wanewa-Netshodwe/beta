import { View, Text, ScrollView } from "react-native";
import React from "react";
import Svg, { G, Path } from "react-native-svg";
import AnimatedText from "./AnimatedText";
import AnimatedCart from "./AnimatedCart";
import { useStates } from "../utilities/States";

type Props = {};

const AddingProductModal = (props: Props) => {
  const { appTheme } = useStates();
  return (
    <View
      style={{ backgroundColor: appTheme.colors?.background }}
      className="p-[5%] w-full h-full items-center"
    >
      {/* <Text>Wallet</Text> */}
      <View style={{ top: 123 }} className="left-56 ">
        <AnimatedText
          size={18}
          letterDelay={125}
          gap={7}
          title="Adding Product "
        />
      </View>

      <View className="absolute">
        <AnimatedCart />
      </View>
      <View>
        <AnimatedText
          direction={"flex-start"}
          textDirection={"left"}
          size={15}
          letterDelay={90}
          resetDelay={5000}
          title="Hang in There"
        />
      </View>
    </View>
  );
};

export default AddingProductModal;
