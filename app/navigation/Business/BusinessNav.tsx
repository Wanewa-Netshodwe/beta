import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ShopLayoutNavigator from "./ShopLayoutNav";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Settings from "../../Screens/Business/Settings";
import SettingsNavigator from "./SettingsNav";

const Tab = createBottomTabNavigator();
const BusinessNav = () => (
  <Tab.Navigator initialRouteName="ShopLayout" screenOptions={{}}>
    <Tab.Screen
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Entypo name="shop" color={color} size={size} />
        ),
      }}
      name="ShopLayout"
      component={ShopLayoutNavigator}
    />
    <Tab.Screen
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="setting" color={color} size={size} />
        ),
      }}
      name="Settings"
      component={SettingsNavigator}
    />
  </Tab.Navigator>
);
export default BusinessNav;
