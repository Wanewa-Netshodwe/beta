import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDynamicStyles } from "../utilities/Styles";
import Spinner from "./Spinner";

type Props = {
  onPress?: (e: any) => void;
  title: string;
  width?: number;
  font?: string;
  className?: string;
  loading?: boolean;
};

const OutlineBtn = ({
  onPress,
  title,
  width,
  font,
  className,
  loading,
}: Props) => {
  const styles = useDynamicStyles();
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View
        className={`bg-transparent ${className} items-center rounded-md gap-1 p-2 w-fit`}
        style={{
          width: width,
          borderColor: appTheme.colors?.secondary,
          borderWidth: 2,
        }}
      >
        <Text style={styles.text} className="text-center">
          {title}
        </Text>
        {loading && <Spinner />}
      </View>
    </TouchableNativeFeedback>
  );
};

export default OutlineBtn;
