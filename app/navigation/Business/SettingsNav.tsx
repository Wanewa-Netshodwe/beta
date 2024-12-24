import { createStackNavigator } from "@react-navigation/stack";

import ChangeAppTheme from "../../Screens/Business/ChangeAppTheme";
import Settings from "../../Screens/Business/Settings";

const Stack = createStackNavigator();
const SettingsNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
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
