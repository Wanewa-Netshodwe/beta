import {
  View,
  Text,
  FlatList,
  ScrollView,
  Button,
  TextInput,
  TouchableNativeFeedback,
} from "react-native";
import React, { useState } from "react";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import CartItem from "../../components/CartItemHolder";
import CartItemHolder from "../../components/CartItemHolder";
import OutlineBtn from "../../components/OutlineBtn";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
type Props = {};

const Cart = (props: Props) => {
  const { CartState } = useStates();

  const style = useDynamicStyles();
  const [grandTotal, setCartTotal] = useState(0);
  const [voucher, setVoucher] = useState("");
  const [process, setProcess] = useState(false);
  const cartitems = useSelector(
    (state: RootState) => state.cartHolderItems.defaultCartHolderItem
  );
  console.log("process :", process);
  console.log("cart total  :", CartState.total);
  return (
    <View className="w-full h-full">
      <View
        style={style.sections}
        className="p-[5%] flex-row items-center justify-between "
      >
        <Text
          style={style.text}
          className="text-[23px] border border-transparent"
        >
          Cart
        </Text>
        <Text
          style={[style.text, { color: "#991b1b" }]}
          className="text-[26px] text-red-800 border border-transparent"
        >
          R{CartState.total!.toFixed(2)}
        </Text>
      </View>
      <ScrollView>
        <View className="p-[5%]">
          <FlatList
            data={cartitems}
            keyExtractor={(item) => item.id!}
            renderItem={({ item }) => (
              <CartItemHolder
                setProcess={setProcess}
                process={process}
                item={item}
                voucher={voucher}
                cartTotal={setCartTotal}
              />
            )}
          />
        </View>
        <View className="p-[5%]">
          <Text style={style.text}>Redeem voucher</Text>
          <View className="items-center flex-row  gap-6">
            <TextInput
              maxLength={8}
              className="w-[160px]"
              style={style.inputs}
              placeholder="Voucher Code"
              value={
                voucher.length > 3 && !voucher.includes("-")
                  ? voucher.toUpperCase().substring(0, 3) +
                    "-" +
                    voucher.toUpperCase().substring(3)
                  : voucher.toUpperCase()
              }
              onChangeText={setVoucher}
            />
            <TouchableNativeFeedback>
              <OutlineBtn
                onPress={() => {
                  setProcess(true);
                }}
                width={85}
                title="Redeem"
              />
            </TouchableNativeFeedback>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Cart;
