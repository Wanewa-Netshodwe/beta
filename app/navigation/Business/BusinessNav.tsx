import {
  BottomTabBarButtonProps,
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import ShopLayoutNavigator from "./ShopLayoutNav";
import { AntDesign, Entypo ,MaterialCommunityIcons} from "@expo/vector-icons";
import Settings from "../../Screens/Business/Settings";
import SettingsNavigator from "./SettingsNav";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import { Text, TouchableNativeFeedback, View } from "react-native";

const Tab = createBottomTabNavigator();
const BusinessNav = () => {
  const { appTheme } = useStates();
  const styles = useDynamicStyles();
  return (
    <Tab.Navigator
      initialRouteName="Layout"
      screenOptions={{
        tabBarActiveTintColor: appTheme.colors?.tertiary,
        tabBarInactiveTintColor: appTheme.colors?.quaternary,
        animation: "fade",
        tabBarLabelStyle: styles.text,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          backgroundColor: appTheme.colors?.primary,
          bottom: 10,
          width: "95%",
          alignSelf: "center",
          borderRadius: 10,
          borderTopWidth: 0,
        },
        tabBarLabel: ({ children }) => {
          return (
            <Text style={styles.text} className="text-[11px]  text-center">
              {children}
            </Text>
          );
        },
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="shop" color={color} size={size} />
          ),
        }}
        name="Layout"
        component={ShopLayoutNavigator}
      />
       <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="wallet" color={color} size={size} />
          ),
        }}
        name="Wallet"
        component={ShopLayoutNavigator}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarButton: ({ accessibilityState, onPress }) => {
            return (
              <TouchableNativeFeedback onPress={onPress}>
                <View
                  style={{
                    alignSelf: "center",
                    padding: 6,
                    height: 60,
                    bottom: 29,
                    backgroundColor: appTheme.colors?.primary,
                    borderRadius: 60,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                    elevation: 7,
                  }}
                >
                  <View style={{}}>
                    <Entypo
                      name="plus"
                      color={
                        accessibilityState?.selected
                          ? appTheme.colors?.tertiary
                          : appTheme.colors?.quaternary
                      }
                      size={45}
                    />
                  </View>
                </View>
              </TouchableNativeFeedback>
            );
          },
        }}
        name="addProduct"
        component={ShopLayoutNavigator}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="order-bool-descending" color={color} size={size} />
          ),
        }}
        name="Orders"
        component={SettingsNavigator}
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
