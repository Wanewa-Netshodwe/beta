import { View, Text, FlatList, ScrollView, Button } from "react-native";
import React, { useState } from "react";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import CartItem from "../../components/CartItemHolder";
import CartItemHolder from "../../components/CartItemHolder";

type Props = {};

const Cart = (props: Props) => {
  const { CartState } = useStates();
  const style = useDynamicStyles();
  const [grandTotal, setCartTotal] = useState(0);
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
          R{grandTotal}
        </Text>
      </View>
      <ScrollView>
        <View className="p-[5%]">
          <FlatList
            data={CartState.items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <CartItemHolder item={item} cartTotal={setCartTotal} />
            )}
          />
        </View>
      </ScrollView>
     
    </View>
  );
};

export default Cart;
