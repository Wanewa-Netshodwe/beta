import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { product, voucherProduct } from "../utilities/Types";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

import { getBusinessById } from "../redux/store";
import { decrement, delCart, increment } from "../redux/businessSlice";
import {
  decrementCartHolder,
  deleteProductCartHolder,
  incrementCartHolder,
} from "../redux/CartItemSlice";
type Props = {
  product: product;
};

const ProductItem = ({ product }: Props) => {
  const dispatch = useDispatch();
  const { appTheme } = useStates();
  const [counter, setCounter] = useState(1);
  const [valid, setValid] = useState(false);

  const Business = getBusinessById(product.store_id!!);
  let discountProducts = Business!.discountedProducts;

  let found = -1;
  if (Business) {
    discountProducts = Business.discountedProducts!!;
    if (discountProducts)
      found = discountProducts.findIndex((dp) => dp.product.id === product.id);
  }
  const [price, setPrice] = useState(
    found !== -1 ? discountProducts!![found].price : product.price
  );

  const [currentPrice, setCurrentPrice] = useState(price);

  const styles = useDynamicStyles();
  const TransX = useSharedValue(100);
  const opacityValue = useSharedValue(0);
  console.log("current Price : R", currentPrice);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: `${TransX.value}%` }],
    opacity: opacityValue.value,
  }));
  const handleIncrement = () => {
    dispatch(increment(price!!));
    dispatch(incrementCartHolder(product));
  };
  const Pan = Gesture.Pan().onEnd((e) => {
    const { translationX } = e;
    if (translationX < -30) {
      TransX.value = withSpring(0, { duration: 50 });
      opacityValue.value = withTiming(0.8, { duration: 450 });
    }
  });
  console.log(counter);
  const handleDecrement = () => {
    if (counter > 1) {
      setCurrentPrice((prev) => prev!! - price!!);
      dispatch(decrement(price!!));
      dispatch(decrementCartHolder(product));
    }
  };
  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={Pan}>
        <TouchableNativeFeedback>
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
                  {price}X {counter}
                </Text>
              </View>

              <View className="flex-row gap-5 right-1">
                <Entypo
                  name="minus"
                  color={appTheme.colors?.textColor}
                  size={15}
                  onPress={() => {
                    handleDecrement();
                    setCounter((prev) => (prev === 1 ? 1 : prev - 1));
                  }}
                />

                <Entypo
                  name="plus"
                  color={appTheme.colors?.textColor}
                  size={15}
                  onPress={() => {
                    if (valid) {
                      null;
                    } else {
                      handleIncrement();
                      setCounter((prev) => prev + 1);
                    }
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
                onPress={() => {
                  const p: product & { cuurentprice: number } = {
                    ...product,
                    cuurentprice: currentPrice!!,
                  };
                  dispatch(delCart({ currentPrice: currentPrice!! }));
                  dispatch(
                    deleteProductCartHolder({
                      product: product,
                      currentPrice: currentPrice!!,
                    })
                  );
                }}
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
        </TouchableNativeFeedback>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default ProductItem;
