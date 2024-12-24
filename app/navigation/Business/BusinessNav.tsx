import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ShopLayoutNavigator from "./ShopLayoutNav";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Settings from "../../Screens/Business/Settings";
import SettingsNavigator from "./SettingsNav";
import { useStates } from "../../utilities/States";

const Tab = createBottomTabNavigator();
const BusinessNav = () => {
  const { appTheme } = useStates();
  return (
    <Tab.Navigator
      initialRouteName="shopLayout"
      screenOptions={{
        tabBarActiveTintColor: appTheme.colors?.primary,
        tabBarInactiveTintColor:appTheme.colors?.quaternary,
        animation:'none'
        
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="shop" color={color} size={size} />
          ),
        }}
        name="shopLayout"
        component={ShopLayoutNavigator}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" color={color} size={size} />
          ),
        }}
        name="settings"
        component={SettingsNavigator}
      />
    </Tab.Navigator>
  );
};
export default BusinessNav;
