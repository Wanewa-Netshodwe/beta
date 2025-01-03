import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet } from "react-native";
import { Provider, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import store from "./app/redux/store";
import BusinessNav from "./app/navigation/Business/BusinessNav";
import Screen from "./app/utilities/Screen";
import { useStates } from "./app/utilities/States";
import "./global.css"; // Ensure this path is correct
import Toast from "react-native-toast-message";
import RootStack from "./app/navigation/RootStack";
import { useEffect } from "react";
import { BE_getAllBusinesses } from "./app/backend/Queries";

LogBox.ignoreAllLogs(true);

export default function AppContent() {
  const { appTheme, businessState, businessForeground } = useStates();
  const dispatch = useDispatch();
  useEffect(() => {
    BE_getAllBusinesses(dispatch);
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
