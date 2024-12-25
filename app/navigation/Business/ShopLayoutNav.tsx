import { createStackNavigator } from "@react-navigation/stack";
import BusinessLayout from "../../Screens/Business/BusinessLayout";
import AddBanner from "../../Screens/Business/AddBanner";

const Stack = createStackNavigator();
const ShopLayoutNavigator = () => (
  <Stack.Navigator initialRouteName="home">
    <Stack.Screen
      options={{ headerShown: false }}
      name="home"
      component={BusinessLayout}
    />
    <Stack.Screen name="banner" component={AddBanner} />
    {/* <Stack.Screen name="Carousel" component={AddCarousel} />
    <Stack.Screen name="ViewProduct" component={ViewProduct} />
    <Stack.Screen name="Section" component={AddSection} />
    <Stack.Screen name="CategoryList" component={ListCategories} />
    <Stack.Screen name="Category" component={Category} /> */}
  </Stack.Navigator>
);
export default ShopLayoutNavigator;
