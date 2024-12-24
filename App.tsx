import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet, Text, View } from "react-native";
import "./global.css";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import store from "./app/redux/store";
import BusinessNav from "./app/navigation/Business/BusinessNav";
import Screen from "./app/utilities/Screen";
import { NavigationContainer } from "@react-navigation/native";
LogBox.ignoreAllLogs(true);
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <BusinessNav />
      </NavigationContainer>

      <StatusBar style="auto" />

      <Toast />
    </Provider>
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
