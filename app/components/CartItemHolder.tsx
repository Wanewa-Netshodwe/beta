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
  const [collapse, setCollapse] = useState(true);
  const [deleted, setDeleted] = useState<number>();

  const [deleteProduct, setDelProduct] = useState<product>();

  const { appTheme, businessState } = useStates();
  const grandTotal = useSelector(
    (state: RootState) => state.cartHolderItems.grandTotal
  );
  const deliveryPrice = useSelector(
    (state: RootState) => state.cartHolderItems.deliveryCost
  );
  const totalPrice = useSelector(
    (state: RootState) => state.cartHolderItems.totalPrice
  );

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
          className="   p-2 items-center justify-between flex-row"
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
            <ScrollView>
              <FlatList
                data={item.products}
                keyExtractor={(item) => item.id!!}
                renderItem={({ item }) => (
                  <View className=" mb-2">
                    <ProductItem product={item} />
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
