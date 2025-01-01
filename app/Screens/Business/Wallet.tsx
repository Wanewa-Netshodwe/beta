import { View, Text, ScrollView } from "react-native";
import React from "react";
import Svg, { G, Path } from "react-native-svg";
import AnimatedCart from "../../components/AnimatedCart";

type Props = {};

const Wallet = (props: Props) => {
  return (
    <View className="p[5%]">
      {/* <Text>Wallet</Text> */}
      <AnimatedCart/>
    </View>
  );
};

export default Wallet;
