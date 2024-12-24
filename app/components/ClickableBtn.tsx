import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDynamicStyles } from "../utilities/Styles";

type Props = {
  onPress?: (e: any) => void;
  title: string;
  width?: number;
  font?: string;
  className?: string;
};

const ClickableBtn = ({ onPress, title, width, font, className }: Props) => {
  const styles = useDynamicStyles();
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View
        style={{
          backgroundColor: appTheme.colors!!.primary,

          width: width || "50%",
        }}
        className={`rounded-md p-3 mt-5  items-center  ${className} `}
      >
        <Text
          style={styles.text}
          className="text-[22px]  font-semibold text-center"
        >
          {title}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

export default ClickableBtn;
