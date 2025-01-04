import {
  View,
  Text,
  Image,
  Pressable,
  TouchableNativeFeedback,
} from "react-native";
import React, { useState } from "react";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import ProductItem from "./ProductItem";

type Props = {};

const CartItem = (props: Props) => {
  const [collapse, setCollapse] = useState(false);
  const { appTheme, businessState } = useStates();
  const styles = useDynamicStyles();

  return (
    <View className="mb-2">
      {/* header */}
      <TouchableNativeFeedback
        onPress={() => {
          setCollapse(!collapse);
        }}
      >
        <View
          style={{
            borderColor: appTheme.colors?.quaternary,
            borderWidth: 2,
            width: 230,
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
            borderBottomWidth: collapse ? 0 : 2,
          }}
          className="  p-2 items-center justify-between flex-row"
        >
          <View className="flex-row gap-2 items-center">
            <Image
              source={{ uri: businessState.store_pic }}
              width={30}
              height={30}
              borderRadius={5}
            />
            <View className="flex-row gap-2 items-center ">
              <Text className="text-[13px] " style={styles.text}>
                {businessState.store_name}
              </Text>
              {businessState.verified && (
                <MaterialIcons
                  name="verified"
                  color={appTheme.colors?.textColor}
                  size={15}
                />
              )}
            </View>
          </View>

          <View>
            <Text className="text-[10px] text-purple-500" style={[styles.text]}>
              Visit store
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>

      {/* Body */}
      {collapse && (
        <View
          style={{
            borderColor: appTheme.colors?.quaternary,
            borderWidth: 2,
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderTopWidth: collapse ? 2 : 0,
          }}
        >
          <View className="mt-2">
            <View className=" mb-2">
              <ProductItem />
            </View>
            <View className=" mb-2">
              <ProductItem />
            </View>
            <View className=" mb-2">
              <ProductItem />
            </View>
          </View>
          <View>
            
          </View>
        </View>
      )}
    </View>
  );
};

export default CartItem;
