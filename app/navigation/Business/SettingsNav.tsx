import { createStackNavigator } from "@react-navigation/stack";

import ChangeAppTheme from "../../Screens/Business/ChangeAppTheme";
import Settings from "../../Screens/Business/Settings";
import BusinessLayout from "../../Screens/Business/BusinessLayout";
import BusinessSettings from "../../Screens/Business/BusinessSettings";
import CreateDiscount from "../../Screens/Business/CreateDiscount";
import CreateVoucher from "../../Screens/Business/CreateVoucher";

const Stack = createStackNavigator();
const SettingsNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ animation: "fade" }}
  >
    <Stack.Screen
      options={{ headerShown: false }}
      name="Home"
      //@ts-ignore
      component={Settings}
    />
    <Stack.Screen
      options={{ headerShown: false }}
      name="AppTheme"
      //@ts-ignore
      component={ChangeAppTheme}
    />
    
    <Stack.Screen
      options={{ headerShown: false }}
      name="BusinessSetting"
      //@ts-ignore
      component={CreateVoucher}
    />

    {/* <Stack.Screen name="Carousel" component={AddCarousel} />
    <Stack.Screen name="ViewProduct" component={ViewProduct} />
    <Stack.Screen name="Section" component={AddSection} />
    <Stack.Screen name="CategoryList" component={ListCategories} />
    <Stack.Screen name="Category" component={Category} />
    <Stack.Screen name="Banner" component={AddBanner} /> */}
  </Stack.Navigator>
);
export default SettingsNavigator;
