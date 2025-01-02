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

const ClickableBtn = ({
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
        style={{
          backgroundColor: appTheme.colors!!.primary,
          ...(loading && { flexDirection: "row" }),
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
        {loading && <Spinner />}
      </View>
    </TouchableNativeFeedback>
  );
};

export default ClickableBtn;
