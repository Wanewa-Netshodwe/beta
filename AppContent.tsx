import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet } from "react-native";
import { Provider, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import Screen from "./app/utilities/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStates } from "./app/utilities/States";
import "./global.css"; // Ensure this path is correct
import Toast from "react-native-toast-message";
import RootStack from "./app/navigation/RootStack";
import { useEffect, useState } from "react";
import { BE_getAllBusinesses } from "./app/backend/Queries";
import { BusinessAccount, DiscountedProducts } from "./app/utilities/Types";
import {
  setDiscountProduct,
  setvoucherProduct,
} from "./app/redux/CartItemSlice";
import { AppState, AppStateStatus } from "react-native";
import React from "react";
import { setColor } from "./app/redux/appSlice";
import { setGuestId } from "./app/redux/userSlice";
LogBox.ignoreAllLogs(true);
export default function AppContent() {
  const { current_screen, businessForeground } = useStates();
  const [appState, setAppState] = useState(AppState.currentState);
  const dispatch = useDispatch();
  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("userSettings");
      const id = await AsyncStorage.getItem("guestId");
      if (id) dispatch(setGuestId(id));
      if (data) {
        const colors = JSON.parse(data);
        dispatch(setColor(colors));
      }
    } catch (err) {
      alert(err);
    }
  };
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === "inactive" || nextAppState === "background") {
      const analytic = await AsyncStorage.getItem(`analytics`);
      if (analytic) {
        console.log(JSON.parse(analytic));
      } else {
        console.log("analytics is null");
      }

      console.log("App has gone to the background.");
    }

    if (nextAppState === "active") {
      console.log("App has come to the foreground.");
    }
    setAppState(nextAppState);
  };
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
      loadData();
      dispatch(setDiscountProduct(discountedProducts.flat()));
      dispatch(setvoucherProduct(voucherProducts.flat()));
    });

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const shouldRenderScreen = current_screen === "layout" && businessForeground;

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
