import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import store from "./app/redux/store";
import BusinessNav from "./app/navigation/Business/BusinessNav";
import Screen from "./app/utilities/Screen";
import { useStates } from "./app/utilities/States";
import "./global.css"; // Ensure this path is correct
import Toast from "react-native-toast-message";
import AppContent from "./AppContent";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
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
