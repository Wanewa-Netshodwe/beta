import { createStackNavigator } from "@react-navigation/stack";
import BusinessLayout from "../../Screens/Business/BusinessLayout";
import AddBanner from "../../Screens/Business/AddBanner";
import AddForegroundImage from "../../Screens/Business/AddForegroundImage";
import AddCarousel from "../../Screens/Business/AddCarousel";
import AddSection from "../../Screens/Business/AddSection";
import ViewProduct from "../../Screens/Business/ViewProduct";
import SearchModal from "../../Screens/Business/SearchModal";

const Stack = createStackNavigator();
const ShopLayoutNavigator = () => (
  <Stack.Navigator initialRouteName="home">
    <Stack.Screen
      options={{ headerShown: false }}
      name="home"
      component={BusinessLayout}
    />
    <Stack.Screen
      options={{ headerShown: false }}
      name="banner"
      component={AddBanner}
    />
    <Stack.Screen name="foregroundImg" component={AddForegroundImage} />
    <Stack.Screen
      name="carousel"
      options={{ headerShown: false }}
      component={AddCarousel}
    />
    <Stack.Screen
      name="section"
      options={{ headerShown: false }}
      component={AddSection}
    />
    <Stack.Screen
      name="searchModal"
      options={{
        headerShown: false,
        presentation: "modal",
        animation: "reveal_from_bottom",
      }}
      component={SearchModal}
    />

    <Stack.Screen
      name="viewProduct"
      options={{ headerShown: false }}
      component={ViewProduct}
    />
    {/* <Stack.Screen name="Carousel" component={AddCarousel} />
    <Stack.Screen name="ViewProduct" component={ViewProduct} />
    <Stack.Screen name="Section" component={AddSection} />
    <Stack.Screen name="CategoryList" component={ListCategories} />
    <Stack.Screen name="Category" component={Category} /> */}
  </Stack.Navigator>
);
export default ShopLayoutNavigator;
