import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDynamicStyles } from "../../utilities/Styles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useStates } from "../../utilities/States";

import { AntDesign } from "@expo/vector-icons";
import {
  DiscountedProducts,
  product,
  voucherProduct,
} from "../../utilities/Types";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ClickableBtn from "../../components/ClickableBtn";
import { useDispatch } from "react-redux";
import {
  addDiscountProduct,
  addVoucherProduct,
} from "../../redux/businessSlice";
import { getBusinessById } from "../../redux/store";
import { SelectList } from "react-native-dropdown-select-list";
import { createRandomId } from "../../backend/Queries";
type Props = {};

const CreateVoucher = (props: Props) => {
  const { appTheme, businessName, businessPic, businessSections, businessId } =
    useStates();
  const extractedProducts = businessSections
    .filter((section) => section.type?.toLowerCase() === "section")
    .flatMap((section) => section.products || []);

  const scale = useSharedValue(0.95);
  const animationStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const [validVouchers, setValidVouchers] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    setProducts(extractedProducts);
  }, []);

  const handleSearch = (name: string) => {
    if (name.length > 1) {
      const sProducts = products.filter((pro) =>
        pro.name?.toLowerCase()?.includes(name)
      );
      console.log("shown products : ", sProducts);
      setShownProducts(sProducts.slice(0, 1));
    }
  };
  const handleSave = () => {
    const v: voucherProduct = {
      ...voucherProducts!!,
      name: name,
    };
    console.log(v);
    dispatch(addVoucherProduct(v));
    console.log("cslled");
  };
  const [products, setProducts] = useState<product[]>([]);
  const [voucher, setVoucher] = useState("");
  const [name, setName] = useState("");
  const [voucherType, setVoucherType] = useState("");
  const [shownProducts, setShownProducts] = useState<product[]>([]);
  const [voucherProducts, setVoucherProduct] = useState<voucherProduct>();
  const [discount, setDiscount] = useState(25);
  const [sel, setSel] = useState<boolean>(false);

  const styles = useDynamicStyles();

  return (
    <View className="w-full h-full">
      <View style={styles.sections} className="p-[5%]">
        <Text style={styles.text} className="text-[23px]">
          Voucher
        </Text>
      </View>
      <ScrollView>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className=" mt-2 p-[5%]"
        >
          <View className="mt-[5%] ">
            <Text style={styles.text} className="text-[18px] font-semibold">
              Voucher Type
            </Text>
          </View>
          <View className="mt-[5%]">
            <SelectList
              setSelected={(val: string) => setVoucherType(val)}
              data={[
                { key: "Giveaway", value: "Giveaway" },
                { key: "Discount", value: "Discount" },
              ]}
              save="value"
              inputStyles={styles.text}
              dropdownTextStyles={styles.text}
              placeholder="Voucher Type"
              search={false}
            />
          </View>
        </View>
        {voucherType === "Discount" && (
          <View style={styles.sections} className="mt-2">
            <Text style={styles.text} className="text-[14px]">
              Discount (%)
            </Text>
            <TextInput
              style={styles.inputs}
              placeholder="25"
              className="w-[50px]"
              keyboardType="numeric"
              value={String(discount)}
              onChangeText={(text) => {
                setDiscount(Number(text));
              }}
            />
          </View>
        )}
        <View style={styles.sections} className="mt-2">
          <Text style={styles.text} className="text-[14px]">
            Voucher Code
          </Text>
          <TextInput
            style={styles.inputs}
            maxLength={8}
            placeholder="Voucher Code"
            className="w-[120px]"
            value={
              voucher.length > 3 && !voucher.includes("-")
                ? voucher.toUpperCase().substring(0, 3) +
                  "-" +
                  voucher.toUpperCase().substring(3)
                : voucher.toUpperCase()
            }
            onChangeText={setVoucher}
          />
        </View>
        <View className="mt-2">
          <View
            style={{ backgroundColor: appTheme.colors!!.primary }}
            className={`  self-center rounded-md w-full h-[45px] relative `}
          >
            <TextInput
              onPress={() => {}}
              style={styles.text}
              onChangeText={handleSearch}
              placeholderTextColor={appTheme.colors?.textColor}
              className=" px-7  text-[16px]  font-semibold   h-full"
              placeholder="Search Product"
            />
          </View>
        </View>
        <View className="mt-2 p-2 flex-row gap-4    max-h-[200px]">
          {shownProducts.length > 0 ? (
            <>
              {shownProducts.map((item, index) => (
                <TouchableNativeFeedback
                  onPress={() => {
                    if (scale.value === 1.1) {
                      scale.value = withTiming(0.95, { duration: 250 });
                    }
                    setSel(false);
                    setVoucherProduct(undefined);
                  }}
                  onLongPress={() => {
                    scale.value = withTiming(1.1, { duration: 250 });
                    setSel(true);
                    const v: voucherProduct = {
                      action:
                        voucherType === "Discount" ? "Discount" : "Giveaway",
                      code: voucher,
                      id: createRandomId(),
                      product: shownProducts[0],
                      quantity: validVouchers,
                      price:
                        voucherType === "Discount"
                          ? item.price!! - item.price!! * (discount / 100)
                          : 0,
                      ...(voucherType === "Discount"
                        ? {
                            discount: discount,
                          }
                        : {}),
                    };
                    setVoucherProduct(v);
                  }}
                >
                  <Animated.View
                    style={[
                      animationStyles,
                      {
                        backgroundColor: appTheme.colors?.primary,
                        borderColor: appTheme.colors?.textColor,
                        borderWidth: 1,
                      },
                    ]}
                    className="border p-2 w-[104px]  relative"
                  >
                    {sel && (
                      <AntDesign
                        name="checkcircle"
                        color={appTheme.colors?.textColor}
                        size={20}
                        className="absolute z-20 -right-2 -top-1"
                      />
                    )}
                    <Image
                      source={{ uri: item.imgs!![0] }}
                      width={90}
                      height={90}
                      className="border rounded-md self-center"
                    />
                    <Text style={styles.text} className="text-[12px] py-1">
                      {item.name!!.substring(0, 25) + "..."}
                    </Text>
                    <Text style={styles.text} className="text-[17px] -top-1 ">
                      R{item.price!!}
                    </Text>
                  </Animated.View>
                </TouchableNativeFeedback>
              ))}
            </>
          ) : (
            <Text style={styles.text}>no Products Found</Text>
          )}
        </View>
        {voucherProducts && (
          <View style={styles.sections} className="mt-2">
            <Text style={styles.text} className="text-[17px]">
              Discount Products
            </Text>
            <View className="mt-2 p-2 flex-row gap-4    max-h-[200px]">
              <TouchableNativeFeedback>
                <Animated.View
                  style={[
                    animationStyles,
                    {
                      backgroundColor: appTheme.colors?.primary,
                      borderColor: appTheme.colors?.textColor,
                      borderWidth: 1,
                    },
                  ]}
                  className="border p-2 w-[104px]  relative"
                >
                  <View
                    style={{ backgroundColor: appTheme.colors?.secondary }}
                    className="absolute rounded-full z-20  h-[33px] w-[33px]  p-1 items-center border -left-3 -top-2"
                  >
                    {/* <Text
                         style={[styles.text, { color: appTheme.colors?.primary }]}
                         className="text-[9px] top-1 text-center"
                       >
                         -{discount}%
                       </Text> */}
                  </View>
                  <Image
                    source={{ uri: voucherProducts?.product.imgs!![0] }}
                    width={90}
                    height={90}
                    className="border rounded-md self-center"
                  />
                  <Text style={styles.text} className="text-[12px] py-1">
                    {voucherProducts?.product.name!!.substring(0, 25) + "..."}
                  </Text>
                  <Text style={styles.text} className="text-[17px] -top-1 ">
                    R{voucherProducts?.price.toFixed(2)}
                  </Text>
                </Animated.View>
              </TouchableNativeFeedback>
            </View>
          </View>
        )}

        <View style={styles.sections} className="mt-2">
          <Text style={styles.text} className="text-[14px]">
            Num of Vouchers
          </Text>
          <View className="mt-1">
            <TextInput
              value={String(validVouchers)}
              keyboardType="numeric"
              onChangeText={(text) => {
                setValidVouchers(Number(text));
              }}
              style={styles.inputs}
              className=" text-[12px] w-[50px]"
            />
          </View>
        </View>
        <View className="mt-2" style={styles.sections}>
          <Text style={styles.text} className="text-[16px]">
            Discount Name
          </Text>
          <TextInput
            placeholder="Discount Name"
            value={name}
            onChangeText={setName}
            className="w-[60%] text-[15px]"
            style={styles.inputs}
          />
        </View>
        <View className="mt-2 px-[5%]">
          <ClickableBtn onPress={handleSave} title="Save" />
        </View>
        <View className="mt-5"></View>
      </ScrollView>
    </View>
  );
};

export default CreateVoucher;
