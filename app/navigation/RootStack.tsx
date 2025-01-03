import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BusinessNav from "./Business/BusinessNav";
import UserNav from "./User/UserNav";

type Props = {};

const RootStack = (props: Props) => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="User">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Business"
        component={BusinessNav}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="User"
        component={UserNav}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
