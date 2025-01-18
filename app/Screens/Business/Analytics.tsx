import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  ScrollView,
  Animated,
  StyleSheet,
} from "react-native";
import {BarChart}from "react-native-chart-kit";
import { PieChart } from "react-native-gifted-charts";
import AnimatedNumbers from "react-native-animated-numbers";
import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Screen from "../../utilities/Screen";
import * as ImagePicker from "expo-image-picker";
import { sectionData, StackShopLayoutParamList } from "../../utilities/Types";
import { useNavigation } from "expo-router";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";
import RadioGroup from "react-native-radio-buttons-group";
import { BE_addSection } from "../../backend/Queries";
import { SelectList } from "react-native-dropdown-select-list";
import { useStates } from "../../utilities/States";
import { StackScreenProps } from "@react-navigation/stack";
import { useDynamicStyles } from "../../utilities/Styles";
import ClickableBtn from "../../components/ClickableBtn";
import { useFocusEffect } from "@react-navigation/native";
import { LineChart } from "react-native-gifted-charts";
import SelectModal from "../../components/SelectModal";
import { MaterialIcons } from "@expo/vector-icons";
type Prop = StackScreenProps<StackShopLayoutParamList, "section">;
const Analytics: React.FC<Prop> = ({ navigation }) => {
  const styles2 = useDynamicStyles();
  const dispatch = useDispatch();
  const { appTheme, businessSections, businessId } = useStates();
  const businessData = businessSections;
  const discountedProducts = useSelector(
    (state: RootState) => state.cartHolderItems.discountedProducts
  );
  const voucherProducts = useSelector(
    (state: RootState) => state.cartHolderItems.voucherProducts
  );
  const [img, setImg] = useState("");
  const [Position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [layout, setLayout] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [numOfProducts, setNumOfProducts] = useState(0);
  const [numOfProductsChange, setNumOfProductsChange] = useState(0);
  const [salesAnalyticsTimeFrame, setSalesAnalyticsTimeFrame] = useState("");
  const [show, setShow] = useState(false);
  const [data, setData] = useState<{ key: number; value: string }[]>([]);
  const [d, setD] = useState<{ key: string; value: number }[]>([]);
  console.log(salesAnalyticsTimeFrame, "sales in fo tinme frame");

  useFocusEffect(
    useCallback(() => {
      setShow(true);
      const dataDummy: { key: string; index: number }[] = businessData
        .filter((item, idx) => item.valid)
        .map((item, idx) => ({ key: item.name, index: idx }));

      const updatedData = dataDummy.flatMap((item) => [
        { key: item.index, value: "Before " + item.key },
        { key: item.index + 1, value: "After " + item.key },
      ]);

      const updatedD = dataDummy.flatMap((item) => [
        { key: "Before " + item.key, value: item.index },
        { key: "After " + item.key, value: item.index + 1 },
      ]);

      setData(updatedData);
      setD(updatedD);

      return () => {
        setData([]);
        setD([]);
      };
    }, [businessData])
  );

  useEffect(() => {
    let sum = 0;
    const numProducts = businessData
      .map((section) => {
        if (section.type === "Section") {
          return section.products ? section.products.length : 0;
        }
      })
      .filter((num) => num != undefined)
      .forEach((num) => (sum += num));
    console.log(numOfProducts);
    setTimeout(() => {
      setNumOfProducts(sum);
    }, 150);
  }, []);
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  const getProducts = useCallback(() => {
    const products = businessData
      .map((section) => {
        if (section.type === "Section") {
          return section.products;
        }
      })
      .filter((num) => num != undefined)
      .flat();
    return products;
  }, [businessData]);

  const calculateNumOfProducts = (timeRange: string) => {
    const products = getProducts();
    console.log(products[0].createdAt < new Date());
    switch (timeRange) {
      case "0": {
        setNumOfProducts(products.length);
        setNumOfProductsChange(0);
        break;
      }
      case "7": {
        if (numOfProductsChange > 0) {
        } else {
          const today = new Date();
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          const validProducts = products
            .map((product) => {
              if (product.createdAt >= weekAgo && product.createdAt <= today) {
                return product;
              }
            })
            .filter((product) => product != undefined);
          const number = validProducts.length;
          const dif = numOfProducts - numOfProductsChange;
          setNumOfProductsChange(dif);
          setNumOfProducts(number);
        }

        break;
      }

      case "14": {
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 14);
        const validProducts = products
          .map((product) => {
            if (product.createdAt >= weekAgo && product.createdAt <= today) {
              return product;
            }
          })
          .filter((product) => product != undefined);
        const number = validProducts.length;
        setNumOfProducts(number);
        break;
      }
      case "21": {
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 21);
        const validProducts = products
          .map((product) => {
            if (product.createdAt >= weekAgo && product.createdAt <= today) {
              return product;
            }
          })
          .filter((product) => product != undefined);
        const number = validProducts.length;
        setNumOfProducts(number);
        break;
      }
    }
  };
  calculateNumOfProducts("dooo");
  const determinePromoCost = useCallback(() => {
    let productsSum = 0;
    let discountSum = 0;
    let voucherSum = 0;
    const products = getProducts();
    products.forEach((product) => {
      productsSum += product.price!;
    });
    if (voucherProducts) {
      voucherProducts.forEach((vp) => {
        if (vp.action === "Giveaway") {
          voucherSum += vp.product.price!;
        } else {
          voucherSum += vp.price;
        }
      });
    }
    if (discountedProducts) {
      discountedProducts.forEach((dp) => {
        discountSum += dp.price!;
      });
    }
    return [productsSum, voucherSum, discountSum];
  }, []);
  const result = determinePromoCost();
  const pieData = [
    { value: result[0], color: appTheme.colors?.tertiary },
    { value: result[1], color: appTheme.colors?.textColor },
    { value: result[2], color: appTheme.colors?.secondary },
  ];
  const createRandomId = useCallback(() => {
    return Math.random().toString(36).substring(2, 27);
  }, []);

  const handleSubmit = () => {
    console.log(d.length < 1);
    const r =
      d.length < 1
        ? [0]
        : d.filter((item) => item.key === Position).map((item) => item.value);

    let num = r[0];
    if (num !== undefined || num === 0) {
      const sectionData: sectionData = {
        id: createRandomId(),
        name: title,
        postion: num,
        businessid: businessId,
        type: "Section",
        layout: layout,
        valid: true,
      };
      const data = {
        sectionInfo: sectionData,
        loading: setLoading,
        dispatch: dispatch,
        navigator: navigation,
      };
      BE_addSection(data);
    }
  };

  const cancel = () => {
    navigation.popTo("home");
  };
  const radioButtons = useMemo(
    () => [
      {
        id: "grid",
        label: "Grid",
        value: "grid",
      },
      {
        id: "row",
        label: "Row",
        value: "row",
      },
    ],
    []
  );
  const datay = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this   work!");
      return;
    }
    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!data.canceled) {
      setImg(data.assets[0].uri);
    }
  };
  console.log(layout === "row");
  const styles = StyleSheet.create({
    cont: {
      backgroundColor: appTheme.colors?.primary,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 9,
    },
  });
  const barData = [
    { value: 150, label: "A" },
    { value: 200, label: "B" },
    { value: 300, label: "C" },
    { value: 100, label: "D" },
  ];
  return (
    <View
      style={{ backgroundColor: appTheme.colors?.background }}
      className="w-full h-full  "
    >
      <View
        style={{ backgroundColor: appTheme.colors?.primary }}
        className="p-[5%] "
      >
        <Text style={styles2.text} className={`text-[24px] `}>
          Analytics
        </Text>
      </View>
      <ScrollView>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%]"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text
                style={styles2.text}
                className="text-[19px] items-center  border-bg -top-1 font-semibold"
              >
                Store Sales
              </Text>
            </View>
            <View>
              <SelectModal
                calculate={calculateNumOfProducts}
                onSelection={setSalesAnalyticsTimeFrame}
                data={[
                  { key: "Now", value: "0" },
                  { key: "Last 7 days ", value: "7" },
                  { key: "Last 14 days ", value: "14" },
                  { key: "Last 2 Months ", value: "2" },
                ]}
              />
            </View>
          </View>
          <View
            style={{ borderColor: appTheme.colors?.textColor, borderWidth: 1 }}
            className=" mt-5  rounded-sm p-2 flex-row flex-wrap"
          >
            <View>
              <View
                style={{
                  borderColor: appTheme.colors?.textColor,
                  borderRightWidth: 1,
                }}
                className="  p-2  w-[170px]"
              >
                <Text style={styles2.text} className="text-[11px]">
                  Orders Processed
                </Text>
                <View>
                  <View className="left-3 flex-row items-center gap-2">
                    <Text
                      style={styles2.text}
                      className="text-[30px] border border-transparent "
                    >
                      25
                    </Text>
                    <View className="flex-row">
                      <MaterialIcons
                        name="trending-up"
                        size={19}
                        color={"green"}
                      />
                      <Text
                        style={{
                          fontFamily: styles2.text.fontFamily,
                          color: "green",
                        }}
                        className="text-[12px]"
                      >
                        13%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  borderColor: appTheme.colors?.textColor,
                  borderRightWidth: 1,
                  borderTopWidth: 1,
                }}
                className="  p-2  w-[170px]"
              >
                <Text style={styles2.text} className="text-[11px]">
                  Products in store
                </Text>
                <View>
                  <View className="left-3 flex-row items-center gap-2">
                    <Text
                      style={styles2.text}
                      className="text-[30px] border border-transparent "
                    >
                      <AnimatedNumbers
                        includeComma
                        animationDuration={1200}
                        animateToNumber={numOfProducts}
                        fontStyle={{
                          color: appTheme.colors?.textColor,
                          fontSize: 30,
                          fontFamily: styles2.text.fontFamily,
                        }}
                      />
                    </Text>
                    {numOfProductsChange !== 0 && (
                      <View className="flex-row">
                        <Text
                          style={{
                            fontFamily: styles2.text.fontFamily,
                            color: numOfProductsChange > 0 ? "green" : "red",
                          }}
                          className="text-[13px]"
                        >
                          {numOfProductsChange > 0 ? "+ " : ""}{" "}
                          {numOfProductsChange}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View className="  p-2  px-4   justify-center  w-[170px]">
              <Text style={styles2.text} className="text-[15px] ">
                Revenue
              </Text>
              <View className="">
                <View className=" flex-row  items-center gap-2">
                  <Text
                    style={styles2.text}
                    className="text-[30px] border border-transparent "
                  >
                    R465<Text className="text-[15px]">.12</Text>
                  </Text>
                  <View className="flex-row">
                    <MaterialIcons
                      name="trending-down"
                      size={19}
                      color={"red"}
                    />
                    <Text
                      style={{
                        fontFamily: styles2.text.fontFamily,
                        color: "red",
                      }}
                      className="text-[12px]"
                    >
                      5.3%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%]"
        >
          <View className="flex-row items-center justify-start">
            <View>
              <Text
                style={styles2.text}
                className="text-[19px]  items-center  border-bg -top-1 font-semibold"
              >
                Promotions
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: appTheme.colors?.quaternarySup,
              borderColor: appTheme.colors?.textColor,
              borderWidth: 0,
            }}
            className=" mt-5  rounded-md p-2 flex-row "
          >
            <View className="flex-1">
              <PieChart
                data={pieData}
                donut
                innerCircleColor={appTheme.colors?.primary}
                focusOnPress
                radius={55}
                isAnimated
                innerRadius={42}
                centerLabelComponent={() => {
                  return (
                    <View className="justify-center items-center">
                      <Text style={styles2.text}>Store</Text>
                      <Text style={styles2.text}>Assets</Text>
                    </View>
                  );
                }}
              />
            </View>

            <View className="  p-2         w-[170px]">
              <View className="flex-row mt-2 gap-3">
                <View
                  className="w-[13px] h-[13px] items-center rounded-full"
                  style={{ backgroundColor: appTheme.colors?.textColor }}
                ></View>
                <Text style={styles2.text} className="text-[10px] ">
                  Voucher Products
                </Text>
              </View>
              <View className="flex-row mt-2 gap-3">
                <View
                  className="w-[13px] h-[13px] items-center rounded-full"
                  style={{ backgroundColor: appTheme.colors?.secondary }}
                ></View>
                <Text style={styles2.text} className="text-[10px] ">
                  Discount Products
                </Text>
              </View>
              <View className="flex-row mt-2 gap-3">
                <View
                  className="w-[13px] h-[13px] items-center rounded-full"
                  style={{ backgroundColor: appTheme.colors?.tertiary }}
                ></View>
                <Text style={styles2.text} className="text-[10px] ">
                  {" "}
                  Products
                </Text>
              </View>
              <View className="top-4">
                <Text style={styles2.text} className="text-[10px]">
                  Cost To Store : R
                  <Text
                    style={{
                      color: "red",
                      fontFamily: styles2.text.fontFamily,
                    }}
                    className="text-[13px]"
                  >
                    {result[1] + result[2]}
                  </Text>{" "}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%]"
        >
          <View className="flex-row items-center justify-start">
            <View>
              <Text
                style={styles2.text}
                className="text-[19px]  items-center  border-bg -top-1 font-semibold"
              >
                Popular Categories
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: appTheme.colors?.quaternarySup,
              borderColor: appTheme.colors?.textColor,
              borderWidth: 0,
            }}
            className=" mt-5  rounded-md p-2 flex-row "
          >
            <View className="border ">
              <View>
                <BarChart
                chartConfig={chartConfig}
                  yAxisSuffix=""
                  data={datay}
                  width={360}
                  height={220}
                  yAxisLabel="$"
                
                
                  verticalLabelRotation={30}
                />
              </View>
            </View>
          </View>
        </View>

        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%] mt-2 "
        >
          <View>
            <Text style={styles2.text} className="text-[18px] font-semibold">
              Section Layout
            </Text>
          </View>
          <View className="mt-[5%]">
            <RadioGroup
              layout="row"
              labelStyle={{
                color: appTheme.colors?.textColor,
                fontSize: 18,
                fontWeight: "bold",
              }}
              radioButtons={radioButtons}
              onPress={(s) => {
                setLayout(s);
              }}
              selectedId={layout}
            />
          </View>
        </View>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%] mt-2 "
        >
          <View>
            <Text style={styles2.text} className="text-[18px] font-semibold">
              Layout Preview
            </Text>
          </View>
          <View>
            <View
              className={`h-fit w-[250px]  justify-center  p-5`}
              style={styles.cont}
            >
              {layout === "grid" ? (
                <>
                  <View
                    style={{ backgroundColor: appTheme.colors?.secondary }}
                    className="w-[80px] h-[80px] rounded-md "
                  />
                  <View
                    style={{
                      backgroundColor: appTheme.colors?.quaternary,
                    }}
                    className="w-[80px] h-[80px] rounded-md"
                  />
                  <View
                    style={{
                      backgroundColor: appTheme.colors?.background,
                    }}
                    className="w-[80px] h-[80px] rounded-md"
                  />
                  <View
                    style={{
                      backgroundColor: appTheme.colors?.textColor,
                    }}
                    className="w-[80px] h-[80px] rounded-md"
                  />
                </>
              ) : (
                <>
                  <ScrollView horizontal>
                    <View
                      style={{ backgroundColor: appTheme.colors?.secondary }}
                      className="w-[80px] h-[80px] rounded-md m-2 "
                    />
                    <View
                      style={{
                        backgroundColor: appTheme.colors?.quaternary,
                      }}
                      className="w-[80px] h-[80px] rounded-md  m-2 "
                    />
                    <View
                      style={{
                        backgroundColor: appTheme.colors?.background,
                      }}
                      className="w-[80px] h-[80px] rounded-md  m-2 "
                    />
                    <View
                      style={{
                        backgroundColor: appTheme.colors?.textColor,
                      }}
                      className="w-[80px] h-[80px] rounded-md  m-2 "
                    />
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </View>
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%] mt-2 "
        >
          <View>
            <Text style={styles2.text} className="text-[18px] font-semibold">
              Position
            </Text>
          </View>
          <View className="mt-[5%]">
            <SelectList
              setSelected={(val: string) => setPosition(val)}
              data={data.length > 0 ? data : [{ key: 0, value: "First" }]}
              save="value"
              inputStyles={styles2.text}
              dropdownTextStyles={styles2.text}
              placeholder="Position"
              search={false}
            />
          </View>
        </View>
        <View className="p-[5%]  justify-between  flex-row">
          <ClickableBtn title="Save" onPress={handleSubmit} width={120} />
          <ClickableBtn
            width={125}
            onPress={() => {
              navigation.popTo("home");
            }}
            title="Cancel"
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default memo(Analytics);
