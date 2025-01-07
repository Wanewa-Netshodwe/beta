import {
  View,
  Text,
  FlatList,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import React from "react";
import {
  product,
  StackShopLayoutParamList,
  sectionData,
  StackStoreListParamList,
} from "../utilities/Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";
import { BE_delProduct, BE_EditProduct } from "../backend/Queries";

type Props = {
  name: string;
  products?: product[];
  section: sectionData;
  nav: StackNavigationProp<StackShopLayoutParamList>;
  edit?: boolean;
};

const MySection = (props: Props) => {
  const dispatch = useDispatch();
  const styles2 = useDynamicStyles();
  const { nav } = props;
  const { appTheme, discountProducts } = useStates();
  console.log("discounted products ", discountProducts);

  const prod = props.products ? props.products : null;
  return (
    <View
      style={{ backgroundColor: appTheme.colors?.primary }}
      className=" p-[5%]  mt-2"
    >
      <View className="flex-row items-center mt-2">
        <Text className=" text-[25px] w-[80%]" style={styles2.text}>
          {props.name}
        </Text>
        <TouchableNativeFeedback>
          <View
            className="bg-transparent rounded-md  p-1 w-[20%]"
            style={{
              borderColor: appTheme.colors!!.tertiary,
              borderWidth: 2,
            }}
          >
            <Text className="text-center  text-[10px]" style={styles2.text}>
              View All
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>

      <View className="mt-[7%] ">
        {prod ? (
          <>
            {props.section.layout === "row" ? (
              <FlatList
                horizontal
                data={prod.slice(0, 4)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                  const found = discountProducts.findIndex(
                    (dp) => dp.product.id === item.id
                  );
                  console.log("found at : ", found);
                  return (
                    <TouchableNativeFeedback
                      onPress={() => {
                        if (!props.edit) {
                          nav.navigate("viewProduct", { product: item });
                        }

                        console.log("prssed");
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: appTheme.colors?.background,
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
                                backgroundColor: appTheme.colors?.background,
                              }}
                              color={appTheme.colors!!.textColor}
                              className=" absolute -top-2 z-50 -left-3    p-2 rounded-full"
                            />
                          )}
                          {props.edit ? (
                            <>
                              <AntDesign
                                name="edit"
                                onPress={() => {
                                  nav.navigate("editProduct", {
                                    product: item,
                                  });
                                }}
                                size={18}
                                color={appTheme.colors?.textColor}
                                className="right-14  top-4 z-20 absolute"
                              />
                              <AntDesign
                                color={appTheme.colors?.textColor}
                                onPress={() => {
                                  BE_delProduct({
                                    dispatch: dispatch,
                                    sectionInfo: item,
                                    navigator: nav,
                                  });
                                }}
                                name="delete"
                                size={18}
                                className="left-1  bottom-1 z-20 absolute"
                              />
                            </>
                          ) : null}

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
                            style={styles2.text}
                          >
                            {item.name!!.length > 50
                              ? item.name?.substring(0, 50) + "..."
                              : item.name}
                          </Text>
                        </View>
                        <View className="flex-row justify-between items-baseline">
                          <Text
                            className="font-semibold relative -top-2 text-[18px] "
                            style={styles2.text}
                          >
                            R
                            {item.auction
                              ? item.auction.startPrice
                              : found != -1
                              ? discountProducts[found].price
                              : item.price}
                          </Text>
                          {item.auction && (
                            <Text
                              className="font-semibold relative -top-2  text-[10px] "
                              style={styles2.text}
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
                              color={appTheme.colors!!.primary}
                            />
                            <Text
                              className="font-semibold relative  text-[13px] "
                              style={styles2.text}
                            >
                              {item.rating}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableNativeFeedback>
                  );
                }}
              />
            ) : (
              <>
                <View className=" gap-2  flex-wrap flex-row  ">
                  {prod.slice(0, 4).map((item, index) => {
                    const found = discountProducts.findIndex(
                      (dp) => dp.product.id === item.id
                    );
                    console.log("found at : ", found);
                    return (
                      <TouchableNativeFeedback
                        onPress={() => {
                          if (!props.edit) {
                            nav.navigate("viewProduct", { product: item });
                          }

                          console.log("prssed");
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: appTheme.colors?.background,
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
                                  backgroundColor: appTheme.colors?.background,
                                }}
                                color={appTheme.colors!!.textColor}
                                className=" absolute -top-2 z-50 -left-3    p-2 rounded-full"
                              />
                            )}
                            {props.edit ? (
                              <>
                                <AntDesign
                                  name="edit"
                                  onPress={() => {
                                    nav.navigate("editProduct", {
                                      product: item,
                                    });
                                  }}
                                  size={18}
                                  color={appTheme.colors?.textColor}
                                  className="right-14  top-4 z-20 absolute"
                                />
                                <AntDesign
                                  color={appTheme.colors?.textColor}
                                  onPress={() => {
                                    BE_delProduct({
                                      dispatch: dispatch,
                                      sectionInfo: item,
                                      navigator: nav,
                                    });
                                  }}
                                  name="delete"
                                  size={18}
                                  className="left-1  bottom-1 z-20 absolute"
                                />
                              </>
                            ) : null}

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
                              style={styles2.text}
                            >
                              {item.name!!.length > 50
                                ? item.name?.substring(0, 50) + "..."
                                : item.name}
                            </Text>
                          </View>
                          <View className="flex-row justify-between items-baseline">
                            <Text
                              className="font-semibold relative -top-2 text-[18px] "
                              style={styles2.text}
                            >
                              R
                              {item.auction
                                ? item.auction.startPrice
                                : found != -1
                                ? discountProducts[found].price
                                : item.price}
                            </Text>
                            {item.auction && (
                              <Text
                                className="font-semibold relative -top-2  text-[10px] "
                                style={styles2.text}
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
                                color={appTheme.colors!!.primary}
                              />
                              <Text
                                className="font-semibold relative  text-[13px] "
                                style={styles2.text}
                              >
                                {item.rating}
                              </Text>
                            </View>
                          )}
                        </View>
                      </TouchableNativeFeedback>
                    );
                  })}
                </View>
              </>
            )}
          </>
        ) : (
          <>
            <Text
              style={styles2.text}
              className="text-[14px] font-semibold text-center mb-5"
            >
              {" "}
              no Products found add a product to the section
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default MySection;
