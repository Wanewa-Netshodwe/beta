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
import { product } from "../utilities/Types";
type Props = {
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  setGrandTotal: React.Dispatch<React.SetStateAction<number>>;
  setDeliveryTotal: React.Dispatch<React.SetStateAction<number>>;
  product: product;
};

const ProductItem = ({
  product,
  setDeliveryTotal,
  setGrandTotal,
  setTotalPrice,
}: Props) => {
  const { appTheme, businessState } = useStates();
  const [counter, setCounter] = useState(1);
  const styles = useDynamicStyles();
  const handleIncrement = () => {
    if (!product.free_delivery) {
      setTotalPrice((prev) => prev + product.price!!);
      setDeliveryTotal((prev) => prev + product.delivery_cost!!);
      setGrandTotal((prev) => prev + product.price!!);
    } else {
      setGrandTotal((prev) => prev + product.price!!);
      setTotalPrice((prev) => prev + product.price!!);
    }
  };
  console.log(counter);
  const handleDecrement = () => {
    if (!product.free_delivery) {
      if (counter !== 1) {
        setTotalPrice((prev) => prev - product.price!!);
        setDeliveryTotal((prev) => prev - product.delivery_cost!!);
        setGrandTotal((prev) => prev - product.price!!);
      }
    } else {
      if (counter !== 1) {
        setGrandTotal((prev) => prev - product.price!!);
        setTotalPrice((prev) => prev - product.price!!);
      }
    }
  };
  return (
    <View className=" rounded-md  p-2 items-center justify-between flex-row">
      <View className="flex-row gap-2 items-center">
        <Image
          source={{ uri: product.imgs!![0] }}
          width={30}
          height={30}
          borderRadius={5}
        />
        <View>
          <Text className="text-[12px] " style={styles.text}>
            {product.name!!.length > 13
              ? product.name?.substring(0, 13) + "..."
              : product.name}
          </Text>
        </View>
      </View>
      <View>
        <Text className="text-[10px]" style={[styles.text, { color: "red" }]}>
          {product.price} X {counter}
        </Text>
      </View>

      <View className="flex-row gap-5 right-1">
        <Entypo
          name="minus"
          color={appTheme.colors?.textColor}
          size={15}
          onPress={() => {
            handleDecrement();
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
            handleIncrement();
            setCounter((prev) => prev + 1);
          }}
        />
      </View>
    </View>
  );
};

export default ProductItem;
