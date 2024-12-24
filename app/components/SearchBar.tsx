import { View, Text, TextInput } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDynamicStyles } from "../utilities/Styles";
type Props = {};

const SearchBar = (props: Props) => {
  const styles = useDynamicStyles();
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  return (
    <View className="mt-8">
      <View
        style={{ backgroundColor: appTheme.colors!!.secondary }}
        className=" self-center rounded-md w-[85%] h-[45px] relative "
      >
        <AntDesign
          size={25}
          color={appTheme.colors?.textColor}
          
          className={`absolute z-40  left-2 top-3 `}
          name="search1"
        />
        <TextInput
          style={styles.text}
          placeholderTextColor={appTheme.colors?.textColor}
          className="w-[85%]   text-[16px]  font-semibold  self-end h-full"
          placeholder="Search Product"
        />
      </View>
    </View>
  );
};

export default SearchBar;
