import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  Button,
} from "react-native";
import React, { useState } from "react";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { product } from "../utilities/Types";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
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
  const TransX = useSharedValue(100);
  const opacityValue = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: `${TransX.value}%` }],
    opacity: opacityValue.value,
  }));
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
  const Pan = Gesture.Pan().onEnd((e) => {
    const { translationX } = e;
    console.log(translationX);
    if (translationX < -30) {
      TransX.value = withSpring(0, { duration: 50 });
      opacityValue.value = withTiming(0.8, { duration: 450 });
    }
  });
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
    <GestureHandlerRootView>
      <GestureDetector gesture={Pan}>
        <View className=" border border-transparent flex-row ">
          <View className="w-full   p-2 items-center justify-between flex-row">
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
              <Text
                className="text-[10px]"
                style={[styles.text, { color: "red" }]}
              >
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
          <Animated.View
            style={[
              animatedStyles,
              { backgroundColor: appTheme.colors?.primary },
            ]}
            className=" opacity-70 border rounded-lg border-transparent flex-row  justify-around  items-center absolute w-full h-full"
          >
            <AntDesign
              name="delete"
              className="border border-transparent"
              color={appTheme.colors?.textColor}
              size={25}
            />

            <AntDesign
              name="close"
              className="border border-transparent"
              color={appTheme.colors?.textColor}
              size={25}
              onPress={() => {
                opacityValue.value = withTiming(0, { duration: 350 });
                TransX.value = withSpring(100, { duration: 90 });
              }}
            />
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default ProductItem;
