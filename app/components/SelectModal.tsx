import {
  View,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
} from "react-native";
import React, { useState } from "react";
import { useStates } from "../utilities/States";
import { Entypo } from "@expo/vector-icons";
import { useDynamicStyles } from "../utilities/Styles";
import { FlatList } from "react-native-gesture-handler";
type Props = {
  onSelection: (item: string) => void;
  data: { key: string; value: string }[];
  calculate: (item: string) => void;
};

const SelectModal = ({ data, onSelection, calculate }: Props) => {
  const { appTheme } = useStates();
  const styles = useDynamicStyles();
  const [toggle, setToggle] = useState(false);
  const [value, setValue] = useState(data[0].key);
  return (
    <View className="relative">
      <TouchableNativeFeedback
        onPress={() => {
          setToggle(!toggle);
        }}
      >
        <View
          style={{ borderColor: appTheme.colors?.textColor, borderWidth: 2 }}
          className="p-2 rounded-md px-3  items-center flex-row gap-2 "
        >
          <Text style={styles.text}>{value} </Text>
          <Entypo color={appTheme.colors?.textColor} name={toggle ? "chevron-up" : "chevron-down"} size={15} />
        </View>
      </TouchableNativeFeedback>
      {toggle && (
        <View className="z-30" style={{backgroundColor:appTheme.colors?.primary, position: "absolute", top: 40 }}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableNativeFeedback
                  onPress={() => {
                    setValue(item.key);
                    setToggle(false);
                    onSelection(item.key);
                    calculate(item.value);
                  }}
                >
                  <View style={{borderBottomWidth:1,borderBottomColor:appTheme.colors?.textColor}} className="mb-2 p-2">
                    <Text style={styles.text}>{item.key}</Text>
                  </View>
                </TouchableNativeFeedback>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default SelectModal;
