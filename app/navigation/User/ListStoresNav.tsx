import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StoreList from "../../Screens/Users/StoreList";
import ViewStore from "../../Screens/Users/ViewStore";
import ViewProduct from "../../Screens/Users/ViewProduct";

type Props = {};

const ListStoresNav = (props: Props) => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="stores">
      <Stack.Screen
        options={{ headerShown: false }}
        name="stores"
        component={StoreList}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="viewStore"
        component={ViewStore}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="viewProduct"
        component={ViewProduct}
      />
    </Stack.Navigator>
  );
};

export default ListStoresNav;
