import {
  View,
  Text,
  Image,
  Pressable,
  TouchableNativeFeedback,
  FlatList,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import ProductItem from "./ProductItem";
import { Cart, CartItem, product } from "../utilities/Types";
import { ScrollView } from "react-native-gesture-handler";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { getBusinessById, RootState } from "../redux/store";
import { useSelector } from "react-redux";

type Props = {
  item: CartItem;
  voucher?: string;
  cartTotal: React.Dispatch<React.SetStateAction<number>>;
  process: boolean;
  setProcess: React.Dispatch<React.SetStateAction<boolean>>;
};

const CartItemHolder = ({
  item,
  cartTotal,
  voucher,
  process,
  setProcess,
}: Props) => {
  let discountProducts = item.business!.discountedProducts;
  const [collapse, setCollapse] = useState(true);

  const { appTheme, businessState } = useStates();
  const carts = useSelector(
    (state: RootState) => state.cartHolderItems.defaultCartHolderItem
  );
  const cart_infos = useSelector(
    (state: RootState) => state.cartHolderItems.defaultCartHolderItemInfo
  );
  const cartIndex = carts.findIndex(
    (cart) => cart.business?.id === item.business?.id
  );
  const totalPrice = cart_infos[cartIndex].totalPrice!;
  const deliveryPrice = cart_infos[cartIndex].deliveryCost!;
  const grandTotal = cart_infos[cartIndex].grandTotal!;
  const [counters, setCounters] = useState<Map<String, number>>();
  const [currentPrices, setCurrentPrices] = useState(new Map<string, number>());
  const [deliveryCosts, setDeliveryCosts] = useState(new Map<string, number>());

  useEffect(() => {
    setCounters((prevCounters) => {
      const updatedCounters = new Map(prevCounters);

      item.products?.forEach((product) => {
        if (!updatedCounters.has(product.id!)) {
          updatedCounters.set(product.id!, 1);
        }
      });

      return updatedCounters;
    });

    setCurrentPrices((prevPrices) => {
      const updatedPrices = new Map(prevPrices);
      let price = item.products![item.products!.length - 1].price!;
      item.products?.forEach((product) => {
        let found = -1;
        if (discountProducts) {
          let found = discountProducts.findIndex(
            (dp) => dp.product.id === product.id
          );
          price =
            found === -1 ? product.price! : discountProducts![found!].price!;
        }

        if (!updatedPrices.has(product.id!)) {
          updatedPrices.set(product.id!, price!);
        }
      });

      return updatedPrices;
    });

    setDeliveryCosts((prevCosts) => {
      const updatedCosts = new Map(prevCosts);

      item.products?.forEach((product) => {
        if (!updatedCosts.has(product.id!)) {
          updatedCosts.set(product.id!, product.delivery_cost ?? 0);
        }
      });

      return updatedCosts;
    });
  }, [item.products]);

  const handleIncrement = (product: product) => {
    let found = -1;
    let price = product.price;
    if (discountProducts) {
      found = discountProducts?.findIndex((dp) => dp.product.id === product.id);
      price = found === -1 ? product.price! : discountProducts![found!].price!;
    }

    console.log("price disccounted : ", price);
    console.log("disccounted products : ", discountProducts);

    setCounters((prev) => {
      const newCounters = new Map(prev);
      newCounters.set(product.id!, newCounters.get(product.id!)! + 1);
      return newCounters;
    });
    setCurrentPrices((prev) => {
      const newCounters = new Map(prev);
      newCounters.set(product.id!, newCounters.get(product.id!)! + price!);
      return newCounters;
    });
    setDeliveryCosts((prev) => {
      const newCounters = new Map(prev);
      newCounters.set(
        product.id!,
        newCounters.get(product.id!)! + product.delivery_cost!
      );
      return newCounters;
    });
  };

  const handleDecrement = (product: product) => {
    let found = -1;
    let price = product.price;
    if (discountProducts) {
      found = discountProducts?.findIndex((dp) => dp.product.id === product.id);
      price = found !== -1 ? discountProducts![found!].price! : product.price!;
    }

    setCounters((prev) => {
      const newCounters = new Map(prev);
      const currentCount = newCounters.get(product.id!) || 1;
      if (currentCount > 1) {
        newCounters.set(product.id!, currentCount - 1);
      }
      return newCounters;
    });
    setCurrentPrices((prev) => {
      const newCounters = new Map(prev);
      newCounters.set(product.id!, newCounters.get(product.id!)! - price!);
      return newCounters;
    });
    setDeliveryCosts((prev) => {
      const newCounters = new Map(prev);
      newCounters.set(
        product.id!,
        newCounters.get(product.id!)! - product.delivery_cost!
      );
      return newCounters;
    });
  };

  const styles = useDynamicStyles();
  console.log("items passed : ", item);
  return (
    <View className="mb-2 ">
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
          className="p-2 items-center justify-between flex-row"
        >
          <View className="flex-row gap-2 items-center">
            <Image
              source={{ uri: item.business?.store_pic }}
              width={30}
              height={30}
              borderRadius={5}
            />
            <View className="flex-row gap-2 items-center ">
              <Text className="text-[13px] " style={styles.text}>
                {item.business!!.store_name}
              </Text>
              {item.business!!.verified && (
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
          <View className="mt-2 max-h-[260px]">
            <ScrollView
            nestedScrollEnabled
            >
              <FlatList
                data={item.products}
                keyExtractor={(item) => item.id!!}
                renderItem={({ item }) => (
                  <View className="mb-2">
                    <ProductItem
                      counter={counters?.get(item.id!)! || 1}
                      onIncrement={() => handleIncrement(item)}
                      onDecrement={() => handleDecrement(item)}
                      product={item}
                      currentPrice={currentPrices.get(item.id!)!}
                    />
                  </View>
                )}
              />
            </ScrollView>
          </View>

          <View className=" px-1">
            <Text style={styles.text} className=" top-1 text-[9px]">
              Delivery Fee : R{deliveryPrice.toFixed(2)}
            </Text>

            <Text style={styles.text} className=" top-1 text-[11px]">
              Total Price : R {totalPrice.toFixed(2)}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text
                style={styles.text}
                className="text-[15px] border-transparent border"
              >
                Grand Total : R {grandTotal.toFixed(2)}
              </Text>
              <Text
                style={styles.text}
                className="text-[8px] -top-1 text-end w-[90px]"
              >
                {item.business?.free_delivery_promo
                  ? `Spend more than ${item.business.free_delivery_promo} for free delivery`
                  : "Free Delivery Promo  not available"}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CartItemHolder;
