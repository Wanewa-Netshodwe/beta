import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableNativeFeedback,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { product, StackShopLayoutParamList } from "../../utilities/Types";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { Keyboard } from "react-native";
import MySection from "../../components/MySection";
type Props = {} & StackScreenProps<StackShopLayoutParamList, "searchModal">;

const SearchModal = ({ navigation }: Props) => {
  const { appTheme, businessState } = useStates();
  const [products, setProducts] = useState<product[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("seacrch scrren called");
  const [isEnterPressed, setIsEnterPressed] = useState(false);
  const styles = useDynamicStyles();
  const SearchProducts = () => {
    const Section_products = businessState.userBusiness.sections.filter(
      (section) => {
        if (section.products)
          if (section.products?.length > 0) {
            return section.products;
          }
      }
    );
    const List_products = Section_products.flatMap((type_product) => {
      if (type_product.products && type_product.products.length > 0) {
        return type_product.products;
      }
      return [];
    });

    const validProducts = List_products.filter((product) => {
      if (product.name?.includes(searchTerm)) {
        return product;
      }
    });
    setProducts(validProducts);
    setProductCount(validProducts.length);
    console.log("valid products : ", validProducts);
  };
  const HighestToLowest = () => {
    const sortedProducts = [...products].sort((a, b) => b.price!! - a.price!!);
    setProducts(sortedProducts);
  };

  const LowestToHighest = () => {
    const sortedProducts = [...products].sort((a, b) => a.price!! - b.price!!);
    setProducts(sortedProducts);
  };

  return (
    <View>
      <View style={styles.sections}>
        <View className="flex-row items-center top-1 gap-4">
          <MaterialIcons
            name="arrow-back-ios-new"
            size={25}
            style={{ color: appTheme.colors?.textColor }}
          />
          <TextInput
            value={searchTerm}
            placeholder="Search Products"
            placeholderTextColor={appTheme.colors?.textColor}
            style={styles.text}
            onSubmitEditing={(e) => {
              setIsEnterPressed(true);
              SearchProducts();
            }}
            onChangeText={(Text) => {
              setIsEnterPressed(false);
              setSearchTerm(Text);
            }}
            className=" text-[17px] top-1 w-full"
          />
        </View>
      </View>
      <ScrollView>
        {products.length === 0 ? (
          <>
            {isEnterPressed ? (
              <View className="p-[5%]">
                <Text style={styles.text}>no Products Found</Text>
              </View>
            ) : null}
          </>
        ) : (
          <>
            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className="justify-center  mt-1 h-[50px]"
            >
              <View className="flex-row h-[50px]">
                <View className="border border-r-0 flex-1 items-center justify-center ">
                  <Text style={styles.text} className="text-[15px]">
                    {productCount} Product(s) found
                  </Text>
                </View>
                <TouchableNativeFeedback onPress={HighestToLowest}>
                  <View className="border flex-2 border-r-0 items-center justify-center ">
                    <Text
                      style={styles.text}
                      className="text-[13px] text-center w-[70px]"
                    >
                      From Highest
                    </Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={LowestToHighest}>
                  <View className="border flex-2 items-center justify-center">
                    <Text
                      style={styles.text}
                      className="text-[13px] text-center w-[70px]"
                    >
                      From Lowest
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>

            <ScrollView>
              <View className="mt-2  p-[5%] gap-2  flex-wrap flex-row  ">
                {products.length > 0 && (
                  <>
                    {products.map((item, index) => {
                      return (
                        <TouchableNativeFeedback
                          key={index}
                          onPress={() => {
                            navigation.navigate("viewProduct", {
                              product: item,
                            });
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: appTheme.colors?.primary,
                              borderColor: appTheme.colors!!.textColor,
                              borderWidth: 1,
                              marginRight: 5,
                            }}
                            className="w-[130px] rounded-sm h-[235px] mb-5  p-1 relative"
                          >
                            <View className="w-[160px] h-[130px] mb-2">
                              {item.free_delivery === "yes" && (
                                <MaterialIcons
                                  name="delivery-dining"
                                  size={20}
                                  style={{
                                    backgroundColor: appTheme.colors?.primary,
                                  }}
                                  color={appTheme.colors!!.textColor}
                                  className=" absolute -top-2 z-50 -left-3    p-2 rounded-full"
                                />
                              )}

                              <Image
                                width={120}
                                height={130}
                                className="rounded-md"
                                source={{ uri: item.imgs!![0] }}
                              />
                            </View>
                            <View>
                              <Text
                                className=" text-[13px] w-[120px] max-h-[48px]  mb-2 "
                                style={styles.text}
                              >
                                {item.name!!.length > 50
                                  ? item.name?.substring(0, 50) + "..."
                                  : item.name}
                              </Text>
                            </View>
                            <View className="flex-row justify-between items-baseline">
                              <Text
                                className="font-semibold relative -top-2 text-[18px] "
                                style={styles.text}
                              >
                                R
                                {item.auction
                                  ? item.auction.startPrice
                                  : item.price}
                              </Text>
                              {item.auction && (
                                <Text
                                  className="font-semibold relative -top-2  text-[10px] "
                                  style={styles.text}
                                >
                                  {" "}
                                  auction
                                </Text>
                              )}
                            </View>
                            {item.rating && (
                              <View className="flex-row -top-3  items-center gap-2">
                                <Feather
                                  name="star"
                                  size={13}
                                  color={appTheme.colors!!.textColor}
                                />
                                <Text
                                  className="font-semibold relative  text-[13px] "
                                  style={styles.text}
                                >
                                  {item.rating}
                                </Text>
                              </View>
                            )}
                          </View>
                        </TouchableNativeFeedback>
                      );
                    })}
                  </>
                )}
              </View>
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchModal;
