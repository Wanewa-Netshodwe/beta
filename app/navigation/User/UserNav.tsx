import {
  BottomTabBarButtonProps,
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Settings from "../../Screens/Business/Settings";
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
import Wallet from "../../Screens/Business/Wallet";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import SignUp from "../../Screens/Users/onBoarding/Signup";
import Start from "../../Screens/Business/onBoarding/Start";
import BusinessInfo from "../../Screens/Business/onBoarding/BusinessInfo";
import Summary from "../../Screens/Business/onBoarding/Summary";
import GoToBusiness from "../../Screens/Users/GoToBusiness";
import ListStoresNav from "./ListStoresNav";
import BusinessSettings from "../../Screens/Business/BusinessSettings";
import Cart from "../../Screens/Users/Cart";

const handleTabPress = () => {
  Vibration.vibrate(100); // Vibrates for 100ms when the tab is pressed
};

const Tab = createBottomTabNavigator();
const UserNav = () => {
  const { appTheme } = useStates();
  const styles = useDynamicStyles();
  return (
    <Tab.Navigator 
    
    
    initialRouteName="signup">
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="signup"
        component={SignUp}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="start"
        component={Start}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="BusInfo"
        component={BusinessInfo}
      />

      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="liststores"
        component={ListStoresNav}
      />

      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="sumary"
        component={Summary}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="UserPage"
        //@ts-ignore
        component={GoToBusiness}
      />

      <Tab.Screen
        options={{
          headerShown: false,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Cart' }],
            });
          },
        }} 
        name="Cart"
        //@ts-ignore
        component={Cart}
      />
    </Tab.Navigator>
  );
};
export default UserNav;
