import {
  BottomTabBarButtonProps,
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import ShopLayoutNavigator from "./ShopLayoutNav";
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Settings from "../../Screens/Business/Settings";
import SettingsNavigator from "./SettingsNav";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import {
  Pressable,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Vibration } from "react-native";
import { addProduct } from "../../redux/businessSlice";
import AddProduct from "../../Screens/Business/AddProduct";
const handleTabPress = () => {
  Vibration.vibrate(100); // Vibrates for 100ms when the tab is pressed
};

const Tab = createBottomTabNavigator();
const BusinessNav = () => {
  const { appTheme } = useStates();
  const styles = useDynamicStyles();
  return (
    <Tab.Navigator
      initialRouteName="Layout"
      screenOptions={{
        tabBarButton: (props) => (
          <Pressable
            {...props}
            onPress={() => {
              props.onPress();
              handleTabPress();
            }}
          />
        ),
        tabBarActiveTintColor: appTheme.colors?.tertiary,
        tabBarInactiveTintColor: appTheme.colors?.quaternary,
        tabBarBackground() {
          return (
            <View
              style={{
                backgroundColor: appTheme.colors?.background,
                borderTopColor: "#bababa",
                borderTopWidth: 1,
              }}
              className=" h-full w-full"
            ></View>
          );
        },
        animation: "fade",
        tabBarLabelStyle: styles.text,
        tabBarIconStyle: { width: 55, height: 45 },

        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: appTheme.colors?.primary,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          width: "100%",
          height: 60,

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
            <Entypo name="shop" color={color} size={30} />
          ),
        }}
        name="Layout"
        component={ShopLayoutNavigator}
      />
      {/* <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <Entypo name="wallet" color={color} size={30} />;
          },
        }}
        name="Wallet"
        component={}
      /> */}
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <AntDesign name="tags" size={30} color={color} />;
          },
        }}
        name="addProduct"
        component={AddProduct}
      />
      {/* <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="order-bool-descending"
              color={color}
              size={30}
            />
          ),
        }}
        name="Orders"
        component={SettingsNavigator}
      /> */}
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" color={color} size={30} />
          ),
        }}
        name="settings"
        component={SettingsNavigator}
      />
    </Tab.Navigator>
  );
};
export default BusinessNav;
