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
  onSelection: (text: string) => void;
  data: string[];
};

const SelectModal = ({ data, onSelection }: Props) => {
  const { appTheme } = useStates();
  const styles = useDynamicStyles();
  const [toggle, setToggle] = useState(false);
  const [value, setValue] = useState(data[0]);
  return (
    <View className="relative">
      <TouchableNativeFeedback
        onPress={() => {
          setToggle(!toggle);
        }}
      >
        <View
          style={{ borderColor: appTheme.colors?.background, borderWidth: 2 }}
          className="p-2 rounded-md px-3  items-center flex-row gap-2 "
        >
          <Text style={styles.text}>{value} </Text>
          <Entypo name={toggle ? "chevron-up" : "chevron-down"} size={15} />
        </View>
      </TouchableNativeFeedback>
      {toggle && (
        <View className="z-30" style={{ position: "absolute", top: 40 }}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableNativeFeedback
                  onPress={() => {
                    setValue(item);
                    setToggle(false);
                    onSelection(item);
                  }}
                >
                  <View className="mb-2 p-2">
                    <Text style={styles.text}>{item}</Text>
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
