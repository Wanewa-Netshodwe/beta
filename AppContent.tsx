import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet } from "react-native";
import { Provider, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import Screen from "./app/utilities/Screen";
import { useStates } from "./app/utilities/States";
import "./global.css"; // Ensure this path is correct
import Toast from "react-native-toast-message";
import RootStack from "./app/navigation/RootStack";
import { useEffect } from "react";
import { BE_getAllBusinesses } from "./app/backend/Queries";
import { BusinessAccount, DiscountedProducts } from "./app/utilities/Types";
import {
  setDiscountProduct,
  setvoucherProduct,
} from "./app/redux/CartItemSlice";
import React from "react";
LogBox.ignoreAllLogs(true);
export default function AppContent() {
  const { appTheme, AllBusiness, businessForeground } = useStates();
  const dispatch = useDispatch();
  useEffect(() => {
    BE_getAllBusinesses(dispatch).then((allBusiness: any) => {
      let discountedProducts: any = [];
      let voucherProducts: any = [];
      allBusiness.map((bus: BusinessAccount) => {
        if (bus.discountedProducts) {
          discountedProducts.push(bus.discountedProducts);
        }
        if (bus.voucherProducts) {
          voucherProducts.push(bus.voucherProducts);
        }
      });
      dispatch(setDiscountProduct(discountedProducts.flat()));
      dispatch(setvoucherProduct(voucherProducts.flat()));
    });
  }, []);

  const shouldRenderScreen =
    appTheme.current_screen === "layout" && businessForeground;

  return (
    <NavigationContainer>
      {shouldRenderScreen ? (
        <RootStack />
      ) : (
        <Screen>
          <RootStack />
        </Screen>
      )}
      <StatusBar style="auto" />
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
