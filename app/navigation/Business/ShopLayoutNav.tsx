import { createStackNavigator } from "@react-navigation/stack";
import BusinessLayout from "../../Screens/Business/BusinessLayout";

const Stack = createStackNavigator();
const ShopLayoutNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      options={{ headerShown: false }}
      name="Home"
      component={BusinessLayout}
    />
    {/* <Stack.Screen name="Carousel" component={AddCarousel} />
    <Stack.Screen name="ViewProduct" component={ViewProduct} />
    <Stack.Screen name="Section" component={AddSection} />
    <Stack.Screen name="CategoryList" component={ListCategories} />
    <Stack.Screen name="Category" component={Category} />
    <Stack.Screen name="Banner" component={AddBanner} /> */}
  </Stack.Navigator>
);
export default ShopLayoutNavigator;
