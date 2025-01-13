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
import { DiscountedProducts, product } from "../../utilities/Types";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ClickableBtn from "../../components/ClickableBtn";
import { useDispatch } from "react-redux";

import { getBusinessById } from "../../redux/store";
import { addDiscountProduct } from "../../redux/CartItemSlice";
type Props = {};

const CreateDiscount = (props: Props) => {
  const [visible, setVisible] = useState({ opening: false, closing: false });
  const { appTheme, businessName, businessPic, businessSections, businessId } =
    useStates();
  const extractedProducts = businessSections
    .filter((section) => section.type?.toLowerCase() === "section")
    .flatMap((section) => section.products || []);
  const boolenlist = extractedProducts.map(() => false);

  const sharedScales = extractedProducts.map(() => useSharedValue(0.95));
  const generatedStyles = sharedScales.map((scale) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }))
  );
  const [openingTime, setOpeningTime] = useState("Start Date");
  const [closingTime, setClosingTime] = useState("End Date");
  const dispatch = useDispatch();
  useEffect(() => {
    setProducts(extractedProducts);
    setSel(boolenlist);
    setScales(sharedScales);
    setAnimatedStyles(generatedStyles);
  }, []);

  const handleSearch = (name: string) => {
    if (name.length > 1) {
      const sProducts = products.filter((pro) =>
        pro.name?.toLowerCase()?.includes(name)
      );
      console.log("shown products : ", sProducts);
      setShownProducts(sProducts);
    }
  };
  const handleSave = () => {
    dispatch(addDiscountProduct(discountedProducts));
    console.log("cslled");
  };
  const [products, setProducts] = useState<product[]>([]);
  const [discount, setDiscount] = useState(25);
  const [name, setName] = useState("");
  const [shownProducts, setShownProducts] = useState<product[]>([]);
  const [discountedProducts, setDiscoutedProducts] = useState<
    DiscountedProducts[]
  >([]);
  const [scales, setScales] = useState<SharedValue<number>[]>([]);
  const [sel, setSel] = useState<boolean[]>([]);
  const [animatedStyles, setAnimatedStyles] = useState<
    {
      transform: {
        scale: number;
      }[];
    }[]
  >([]);

  const styles = useDynamicStyles();

  return (
    <View className="w-full h-full">
      <View style={styles.sections} className="p-[5%]">
        <Text style={styles.text} className="text-[23px]">
          Discounts
        </Text>
      </View>
      <ScrollView>
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
                    if (scales[index].value === 1.1) {
                      scales[index].value = withTiming(0.95, { duration: 250 });
                    }
                    const selected = [...sel];
                    selected[index] = false;
                    setSel(selected);
                    const s = [...discountedProducts];
                    const idx = s.findIndex((dp) => dp.product.id === item.id);
                    s.splice(idx, 1);
                    setDiscoutedProducts(s);
                  }}
                  onLongPress={() => {
                    scales[index].value = withTiming(1.1, { duration: 250 });
                    const selected = [...sel];
                    selected[index] = true;
                    setSel(selected);
                    const idx = discountedProducts.findIndex(
                      (dp) => dp.product === item.id
                    );
                    if (idx === -1) {
                      const discountProduct: DiscountedProducts = {
                        store_id: businessId,
                        product: item,
                        discount: discount,
                        price: item.price!! - item.price!! * (discount / 100),
                        expDate: {
                          from: openingTime,
                          to: closingTime,
                        },
                        name: name,
                      };
                      setDiscoutedProducts((prev) => [
                        ...prev,
                        discountProduct,
                      ]);
                    }
                  }}
                >
                  <Animated.View
                    style={[
                      animatedStyles[index],
                      {
                        backgroundColor: appTheme.colors?.primary,
                        borderColor: appTheme.colors?.textColor,
                        borderWidth: 1,
                      },
                    ]}
                    className="border p-2 w-[104px]  relative"
                  >
                    {sel[index] && (
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
        <View style={styles.sections} className="mt-2">
          <Text style={styles.text} className="text-[17px]">
            Discount Products
          </Text>
          <View className="mt-2 p-2 flex-row gap-4    max-h-[200px]">
            {discountedProducts.map((item, index) => (
              <TouchableNativeFeedback>
                <Animated.View
                  style={[
                    animatedStyles[index],
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
                    <Text
                      style={[styles.text, { color: appTheme.colors?.primary }]}
                      className="text-[9px] top-1 text-center"
                    >
                      -{discount}%
                    </Text>
                  </View>
                  <Image
                    source={{ uri: item.product.imgs!![0] }}
                    width={90}
                    height={90}
                    className="border rounded-md self-center"
                  />
                  <Text style={styles.text} className="text-[12px] py-1">
                    {item.product.name!!.substring(0, 25) + "..."}
                  </Text>
                  <Text style={styles.text} className="text-[17px] -top-1 ">
                    R{item.price?.toFixed(2)}
                  </Text>
                </Animated.View>
              </TouchableNativeFeedback>
            ))}
          </View>
        </View>
        <View style={styles.sections} className="mt-2">
          <Text style={styles.text} className="text-[14px]">
            Duration
          </Text>
          <View className="mt-1">
            <View>
              <Text style={styles.text} className="text-[13px]">
                From
              </Text>
              <TouchableNativeFeedback
                onPress={() => {
                  setVisible({ ...visible, opening: true });
                }}
              >
                <View className="w-[50%]">
                  <TextInput
                    editable={false}
                    value={openingTime}
                    style={styles.inputs}
                    className=" text-[12px]"
                  />
                </View>
              </TouchableNativeFeedback>
            </View>
            <View className="mt-1">
              <Text style={styles.text} className="text-[13px]">
                To
              </Text>
              <TouchableNativeFeedback
                onPress={() => {
                  setVisible({ ...visible, closing: true });
                }}
              >
                <View className="w-[50%]">
                  <TextInput
                    editable={false}
                    value={closingTime}
                    style={styles.inputs}
                    className="   text-[12px]"
                  />
                </View>
              </TouchableNativeFeedback>
            </View>
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
      <DateTimePickerModal
        isVisible={visible.opening}
        mode="date"
        onConfirm={(time) => {
          setOpeningTime(time.toDateString());
          setVisible({ ...visible, opening: false });
        }}
        onCancel={() => setVisible({ ...visible, opening: false })}
      />
      <DateTimePickerModal
        isVisible={visible.closing}
        mode="date"
        onConfirm={(time) => {
          setClosingTime(time.toDateString());
          setVisible({ ...visible, closing: false });
        }}
        onCancel={() => setVisible({ ...visible, closing: false })}
      />
    </View>
  );
};

export default CreateDiscount;
