import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
} from "react-native";
import React, { useState } from "react";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";
import { Entypo } from "@expo/vector-icons";
type Props = {};

const ProductItem = (props: Props) => {
  const { appTheme, businessState } = useStates();
  const [counter, setCounter] = useState(1);
  const styles = useDynamicStyles();
  return (
    <View className=" rounded-md  p-2 items-center justify-between flex-row">
      <View className="flex-row gap-2 items-center">
        <Image
          source={{ uri: businessState.store_pic }}
          width={30}
          height={30}
          borderRadius={5}
        />
        <View>
          <Text className="text-[12px] " style={styles.text}>
            {businessState.store_name}
          </Text>
        </View>
      </View>
      <View>
        <Text className="text-[10px]" style={[styles.text, { color: "red" }]}>
          -R340 X {counter}
        </Text>
      </View>

      <View className="flex-row gap-5 right-1">
        <Entypo
          name="minus"
          color={appTheme.colors?.textColor}
          size={15}
          onPress={() => {
            setCounter((prev) => {
              return prev - 1 < 1 ? 1 : prev - 1;
            });
          }}
        />

        <Entypo
          name="plus"
          color={appTheme.colors?.textColor}
          size={15}
          onPress={() => {
            setCounter((prev) => prev + 1);
          }}
        />
      </View>
    </View>
  );
};

export default ProductItem;
