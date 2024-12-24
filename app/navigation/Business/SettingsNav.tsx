import { createStackNavigator } from "@react-navigation/stack";

import ChangeAppTheme from "../../Screens/Business/ChangeAppTheme";
import Settings from "../../Screens/Business/Settings";
import BusinessLayout from "../../Screens/Business/BusinessLayout";

const Stack = createStackNavigator();
const SettingsNavigator = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{animation:'reveal_from_bottom'}}>
    <Stack.Screen
      options={{ headerShown: false }}
      name="Home"
      component={Settings}
    />
    <Stack.Screen
      options={{ headerShown: false }}
      name="AppTheme"
      component={ChangeAppTheme}
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
