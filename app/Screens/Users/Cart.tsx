import { View, Text, FlatList, ScrollView } from "react-native";
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
      <View style={style.sections} className="p-[5%]">
        <Text style={style.text} className="text-[17px]">
          Cart
        </Text>
        <Text style={style.text} className="text-[23px]">
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
