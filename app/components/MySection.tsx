import {
  View,
  Text,
  FlatList,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import React from "react";
import { product, StackShopLayoutParamList, sectionData } from "../utilities/Types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";

type Props = {
  name: string;
  products?: product[];
  section: sectionData;
  nav: StackNavigationProp<StackShopLayoutParamList>;
};

const MySection = (props: Props) => {
  const styles2 = useDynamicStyles()
  const { nav } = props;
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
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
            <Text
              className="text-center  text-[10px]"
              style={styles2.text}
            >
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
                renderItem={({ item }) => (
                  <TouchableNativeFeedback
                    onPress={() => {
                      nav.navigate("viewProduct", { product: item });
                      console.log("prssed");
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: appTheme.colors!!.quaternary,
                        borderColor: appTheme.colors!!.primary,
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
                              backgroundColor: appTheme.colors!!.primary,
                            }}
                            color={appTheme.colors!!.tertiary}
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
                          className="font-medium text-[13px] w-[120px] max-h-[48px]  mb-2 "
                          style={{ color: appTheme.colors!!.tertiary }}
                        >
                          {item.name!!.length > 50
                            ? item.name?.substring(0, 50) + "..."
                            : item.name}
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-baseline">
                        <Text
                          className="font-semibold relative -top-2 text-[18px] "
                          style={{ color: appTheme.colors!!.tertiary }}
                        >
                          R{item.auction ? item.auction.startPrice : item.price}
                        </Text>
                        {item.auction && (
                          <Text
                            className="font-semibold relative -top-2  text-[10px] "
                            style={{ color: appTheme.colors!!.tertiary }}
                          >
                            {" "}
                            auction
                          </Text>
                        )}
                      </View>
                      {item.rating && (
                        <View className="flex-row -top-1  items-center gap-2">
                          <Feather
                            name="star"
                            size={13}
                            color={appTheme.colors!!.tertiary}
                          />
                          <Text
                            className="font-semibold relative  text-[13px] "
                            style={{ color: appTheme.colors!!.tertiary }}
                          >
                            {item.rating}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableNativeFeedback>
                )}
              />
            ) : (
              <>
                <FlatList
                  horizontal
                  data={prod.slice(0, 2)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableNativeFeedback
                      onPress={() => {
                        nav.navigate("viewProduct", { product: item });
                        console.log("prssed");
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: appTheme.colors!!.quaternary,
                          borderColor: appTheme.colors!!.primary,
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
                                backgroundColor: appTheme.colors!!.primary,
                              }}
                              color={appTheme.colors!!.tertiary}
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
                            className="font-medium text-[13px] w-[120px] max-h-[48px]  mb-2 "
                            style={{ color: appTheme.colors!!.tertiary }}
                          >
                            {item.name!!.length > 50
                              ? item.name?.substring(0, 50) + "..."
                              : item.name}
                          </Text>
                        </View>
                        <View className="flex-row justify-between items-baseline">
                          <Text
                            className="font-semibold relative -top-2 text-[18px] "
                            style={{ color: appTheme.colors!!.tertiary }}
                          >
                            R
                            {item.auction
                              ? item.auction.startPrice
                              : item.price}
                          </Text>
                          {item.auction && (
                            <Text
                              className="font-semibold relative -top-2  text-[10px] "
                              style={{ color: appTheme.colors!!.tertiary }}
                            >
                              {" "}
                              auction
                            </Text>
                          )}
                        </View>
                        {item.rating && (
                          <View className="flex-row -top-1  items-center gap-2">
                            <Feather
                              name="star"
                              size={13}
                              color={appTheme.colors!!.tertiary}
                            />
                            <Text
                              className="font-semibold relative  text-[13px] "
                              style={{ color: appTheme.colors!!.tertiary }}
                            >
                              {item.rating}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableNativeFeedback>
                  )}
                />
                <FlatList
                  horizontal
                  data={prod.slice(2, 4)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableNativeFeedback
                      onPress={() => {
                        nav.navigate("viewProduct", { product: item });
                        console.log("prssed");
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: appTheme.colors!!.quaternary,
                          borderColor: appTheme.colors!!.primary,
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
                                backgroundColor: appTheme.colors!!.primary,
                              }}
                              color={appTheme.colors!!.tertiary}
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
                            className="font-medium text-[13px] w-[120px] max-h-[48px]  mb-2 "
                            style={{ color: appTheme.colors!!.tertiary }}
                          >
                            {item.name!!.length > 50
                              ? item.name?.substring(0, 50) + "..."
                              : item.name}
                          </Text>
                        </View>
                        <View className="flex-row justify-between items-baseline">
                          <Text
                            className="font-semibold relative -top-2 text-[18px] "
                            style={{ color: appTheme.colors!!.tertiary }}
                          >
                            R
                            {item.auction
                              ? item.auction.startPrice
                              : item.price}
                          </Text>
                          {item.auction && (
                            <Text
                              className="font-semibold relative -top-2  text-[10px] "
                              style={{ color: appTheme.colors!!.tertiary }}
                            >
                              {" "}
                              auction
                            </Text>
                          )}
                        </View>
                        {item.rating && (
                          <View className="flex-row -top-1  items-center gap-2">
                            <Feather
                              name="star"
                              size={13}
                              color={appTheme.colors!!.tertiary}
                            />
                            <Text
                              className="font-semibold relative  text-[13px] "
                              style={{ color: appTheme.colors!!.tertiary }}
                            >
                              {item.rating}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableNativeFeedback>
                  )}
                />
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
