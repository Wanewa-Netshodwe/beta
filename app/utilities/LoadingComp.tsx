import { View, Text } from "react-native";
import React from "react";
import { TextLoader } from "./Loaders";

type Props = {
  loaded: boolean;
  item: JSX.Element;
};

const LoadingComp = ({ loaded, item }: Props) => {
  return (
    <View>{loaded ? item : <TextLoader  width={"Shop Layout".length} />}</View>
  );
};

export default LoadingComp;
