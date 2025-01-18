import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextInput,
  TouchableNativeFeedback,
  Animated,
} from "react-native";
import { Rating } from "react-native-ratings";
import StarRating from "react-native-star-rating-widget";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Screen from "../../utilities/Screen";
import { getBusinessById, getUserId, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import WebView from "react-native-webview";
import {
  Table,
  Col,
  Row,
  TableWrapper,
  Rows,
} from "react-native-table-component";
// import StarRating from "react-native-star-rating-widget";
import * as Progress from "react-native-progress";
import {
  analytics,
  CartItem,
  customerAnalytics,
  DiscountedProducts,
  reviews,
  StackShopLayoutParamList,
  StackStoreListParamList,
  TabParamList,
} from "../../utilities/Types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useVideoPlayer, VideoView } from "expo-video";
import Carousel from "react-native-reanimated-carousel";
import { useStates } from "../../utilities/States";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { useDynamicStyles } from "../../utilities/Styles";
import { convertT, convertTime } from "../../utilities/convertTime";
import { StackScreenProps } from "@react-navigation/stack";
import { createRandomId, getUid, getUserInfo } from "../../backend/Queries";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { addCart } from "../../redux/CartItemSlice";
import { getColors } from "react-native-image-colors";
import tinycolor from "tinycolor2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setGuestId } from "../../redux/userSlice";
type Props = StackScreenProps<StackStoreListParamList, "viewProduct">;

const ViewProduct: React.FC<Props> = memo(({ route }) => {
  const lightenColor = (color: string, perc: number = 10) => {
    return tinycolor(color).lighten(perc).toString();
  };
  const isColorDark = (color: string) => {
    const rgb = tinycolor(color).toRgb();
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance < 0.5;
  };
  const { product } = route.params;
  console.log("view scrren called");
  const load = () => {
    getColors(product.imgs![0], {
      fallback: "#228B22",
      cache: true,
      key: product.imgs![0],
    }).then((v) => {
      //@ts-ignore
      setBg(v.dominant);
      //@ts-ignore
      if (isColorDark(v.darkVibrant)) {
        //@ts-ignore
        setTextColor(lightenColor(v.darkVibrant, 30));
      } else {
        //@ts-ignore
        setTextColor(v.darkVibrant);
      }
    });
  };
  load();
  const RenderImage = useCallback(({ item }: any) => {
    return (
      <Image
        key={item.toString()}
        source={{ uri: item }}
        width={width - 5}
        height={250}
      />
    );
  }, []);
  const styles = useDynamicStyles();

  const Business = getBusinessById(product.store_id!!);
  !Business && console.log("business not found");
  const [Video, setVideo] = useState("");
  const [loading, setLoading] = useState(true);
  const [ReviewStarsInfo, setReviewStarsInfo] = useState([
    { star: { value: 1, num_of_people: 0, perc: 0 } },
    { star: { value: 2, num_of_people: 0, perc: 0 } },
    { star: { value: 3, num_of_people: 0, perc: 0 } },
    { star: { value: 4, num_of_people: 0, perc: 0 } },
    { star: { value: 5, num_of_people: 0, perc: 0 } },
  ]);

  const [ArrHeight, setArrHeight] = useState<number[]>([]);
  const [tableData, setTableData] = useState<{
    info: string[];
    property: string[];
  }>({
    info: [],
    property: [],
  });
  const { width } = Dimensions.get("screen");
  const { appTheme, userState } = useStates();
  let discountProducts: DiscountedProducts[] = [];
  let found = -1;
  if (Business) {
    discountProducts = Business.discountedProducts!!;
    if (discountProducts)
      found = discountProducts.findIndex((dp) => dp.product.id === product.id);
  }
  const player = useVideoPlayer(Video, (player) => {
    player.pause();
  });
  const [bidPrice, setBidPrice] = useState("16765");
  const currentPrice = 16765;
  const [visible, setVisible] = useState(false);
  const [bg, setBg] = useState(appTheme.colors?.primary);
  const [darkColor, setdarkColor] = useState(false);
  const [textColor, setTextColor] = useState(styles.text.color);
  const scaleValue = useSharedValue(1);
  const paddingValue = useSharedValue(8);
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: appTheme.colors?.secondary!!,
    transform: [{ scale: withTiming(scaleValue.value, { duration: 300 }) }],
    padding: withTiming(paddingValue.value, { duration: 300 }),
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    if (product.video) {
      setVideo(product.video.uri);
    }
    let productInfomation: {
      info: string[];
      property: string[];
    } = { info: [], property: [] };
    if (product.product_info) {
      product.product_info.map((info) => {
        productInfomation.info.push(info.info!!);
        productInfomation.property.push(info.property!!);
      });
    }
    setTableData(productInfomation);
    let arr = Array.from({ length: productInfomation.info.length }, () => 65);
    setArrHeight(arr);
    let stars = new Map<number, number>([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ]);

    product.reviews?.forEach((review) => {
      let rating = review.rating;
      if (stars.has(rating)) {
        //@ts-ignore
        stars.set(rating, stars.get(rating) + 1);
      }
    });

    let starsInfo = [];
    for (let [key, value] of stars.entries()) {
      starsInfo.push({
        star: {
          value: key,
          num_of_people: value,
          perc: value / product.reviews!!.length,
        },
      });
    }

    setReviewStarsInfo(starsInfo);
    console.log(starsInfo);
    setLoading(false);
  }, []);
  console.log("stars are :", ReviewStarsInfo);
  console.log("siscounted products", discountProducts);
  const addToCart = () => {
    console.log("clicked");
    scaleValue.value = 7;
    paddingValue.value = 32;
    const cartItem: CartItem = {
      id: createRandomId(),
      products: [product],
      ...(Business ? { business: Business } : {}),
      userId: getUserId(),
    };
    const price =
      found != -1 ? discountProducts!![found].product.price : product.price;
    dispatch(addCart(cartItem));

    // console.log("cart itemsj", CartState.items);
  };
  const validPrice = () => {
    const num = Number(bidPrice);
    if (num < currentPrice || num - currentPrice < 90) {
      console.log("invalid ");
    } else {
      console.log("valid");
    }
  };

  useEffect(() => {
    setdarkColor(isColorDark(bg!));
  }, [bg]);
  // useEffect(() => {
  //   if (darkColor) {
  //     setTextColor("white");
  //   }
  // }, [darkColor]);
  console.log("color is dark : ", darkColor);

  console.log(textColor);

  return (
    <View style={{ backgroundColor: lightenColor(bg!) }} className="relative">
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <Animated.View
              style={[animatedStyle, { transform: [{ scale: 0.7 }] }]}
              className="p-2 z-50 absolute border top-[14%] rounded-md"
            >
              <Text
                style={{ color: textColor, fontFamily: styles.text.fontFamily }}
              >
                Added To Cart
              </Text>
            </Animated.View>
            <View
              style={{ backgroundColor: bg, padding: styles.sections.padding }}
              className="   p-[2%] gap-5 flex-row items-center "
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                size={20}
                style={{ color: textColor }}
              />
              <Text
                style={{ color: textColor, fontFamily: styles.text.fontFamily }}
                className=" top-2 text-[15px] "
              >
                {product.name}
              </Text>
            </View>

            <View
              style={{
                width: width,
              }}
              className=""
            >
              {product.imgs && product.imgs?.length > 1 ? (
                <>
                  <Carousel
                    height={250}
                    width={width}
                    autoPlay={false}
                    pagingEnabled={true}
                    scrollAnimationDuration={500}
                    data={product.imgs!!}
                    renderItem={RenderImage}
                  />
                </>
              ) : (
                <Image
                  source={{ uri: product.imgs!![0] }}
                  width={width}
                  height={250}
                  className="self-center"
                />
              )}
            </View>
            <View
              style={{ backgroundColor: bg, padding: styles.sections.padding }}
              className=" "
            >
              <View className="  ">
                <Text
                  className="text-[20px] font-semibold"
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  {product.name!!}
                </Text>
              </View>
              {product.rating ? (
                <>
                  <View className=" mt-2  flex-row items-center">
                    <Feather
                      name="star"
                      size={16}
                      style={{ color: appTheme.colors?.tertiary }}
                      className="w-[20px]"
                    />
                    <Text
                      className="text-[14px] font-semibold w-[25px]"
                      style={{
                        color: textColor,
                        fontFamily: styles.text.fontFamily,
                      }}
                    >
                      {product.rating}
                    </Text>
                    <Text
                      className="text-[14px] font-semibold"
                      style={{
                        color: textColor,
                        fontFamily: styles.text.fontFamily,
                      }}
                    >
                      {product.reviews?.length!!} REVIEWS
                    </Text>
                  </View>
                </>
              ) : null}
            </View>

            <View
              style={{ backgroundColor: bg, padding: styles.sections.padding }}
              className=" mt-1   flex-row items-center justify-between "
            >
              <Text
                className="text-[34px]  w-fit"
                style={{ color: textColor, fontFamily: styles.text.fontFamily }}
              >
                R{" "}
                {product.auction
                  ? product.auction.started
                    ? product.auction.bidPrice
                    : product.auction.startPrice
                  : found != -1
                  ? discountProducts!![found].price
                  : product.price}
              </Text>
              {found != -1 && (
                <View>
                  <Text
                    className="text-[17px]  -top-1  w-fit"
                    style={[
                      { color: textColor, fontFamily: styles.text.fontFamily },
                      { color: "grey" },
                    ]}
                  >
                    R{discountProducts!![found].product.price}
                  </Text>
                  <View
                    className="absolute w-[100%] top-[8px]"
                    style={{ borderColor: "grey", borderWidth: 1 }}
                  ></View>
                </View>
              )}
              <View className="mr-4 items-end">
                <Text
                  className="text-[12px] font-semibold"
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  delivery cost
                </Text>
                <Text
                  className="text-[14px]  "
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  R{product.delivery_cost ? product.delivery_cost : "0"}
                </Text>
              </View>
            </View>
            {product.auction ? (
              <>
                <View
                  style={{
                    backgroundColor: bg,
                    padding: styles.sections.padding,
                  }}
                  className="mt-2   flex-row items-center justify-between "
                >
                  <View className="mr-4 gap-1">
                    <Text
                      className="text-[12px] font-semibold "
                      style={{
                        color: textColor,
                        fontFamily: styles.text.fontFamily,
                      }}
                    >
                      Start Date
                    </Text>
                    <Text
                      className="text-[14px] "
                      style={{
                        color: textColor,
                        fontFamily: styles.text.fontFamily,
                      }}
                    >
                      12/12/2024 00:00
                    </Text>
                  </View>
                </View>
              </>
            ) : null}
            {product.auction ? (
              <View
                style={{
                  backgroundColor: bg,
                  padding: styles.sections.padding,
                }}
                className="mt-2  px-4 flex-row items-center justify-between "
              >
                <View className="mr-4 gap-1">
                  <Text
                    className="text-[12px] font-semibold "
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    Closing Date
                  </Text>
                  <Text
                    className="text-[14px] font-extrabold "
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    17/12/2024 16:30
                  </Text>
                </View>
                <View className="mr-4 items-end">
                  <Text
                    className="text-[12px] font-semibold"
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    bid increment
                  </Text>
                  <Text
                    className="text-[14px] font-bold "
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    R90
                  </Text>
                </View>
              </View>
            ) : null}

            <View
              style={{ backgroundColor: bg, padding: styles.sections.padding }}
              className="mt-2    flex-row items-center justify-between "
            >
              <TouchableNativeFeedback
                onPress={() => {
                  addToCart();
                }}
              >
                <View
                  style={{
                    borderColor: textColor,
                    borderWidth: 2,
                  }}
                  className="p-2 items-center"
                >
                  <Text
                    className="text-[23px]  "
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    {product.auction
                      ? `Bid R${
                          product.auction.bidPrice!! +
                          product.auction.bidIncrement!!
                        }`
                      : `Buy R${
                          found != -1
                            ? discountProducts!![found].price
                            : product.price
                        }`}
                  </Text>
                </View>
              </TouchableNativeFeedback>

              {product.auction ? (
                <View className="mr-4 flex-row gap-9">
                  <Feather
                    name="edit"
                    size={30}
                    style={{ color: appTheme.colors?.tertiary }}
                    onPress={() => {
                      setVisible(!visible);
                    }}
                  />
                </View>
              ) : null}
            </View>
            {product.auction ? (
              <>
                <View
                  style={{
                    backgroundColor: bg,
                    padding: styles.sections.padding,
                  }}
                  className="mt-2 "
                >
                  <View className="  flex-row items-center ">
                    <Text
                      className="text-[20px]  "
                      style={{
                        color: textColor,
                        fontFamily: styles.text.fontFamily,
                      }}
                    >
                      Winning Bid
                    </Text>
                  </View>
                  <View className="mt-[4%]   flex-row items-center justify-between ">
                    <View
                      style={{
                        borderColor: textColor,
                        borderWidth: 2,
                        width: width - 35,
                      }}
                      className=" flex-row items-center p-2 "
                    >
                      <View className="flex-row w-[200px] items-center gap-4">
                        <View
                          style={{
                            borderColor: appTheme.colors?.tertiary,
                            borderWidth: 2,
                          }}
                          className=" w-[35px] h-[35px]  rounded-sm"
                        ></View>
                        <Text
                          className="text-[20px]  "
                          style={{
                            color: textColor,
                            fontFamily: styles.text.fontFamily,
                          }}
                        >
                          Stanley
                        </Text>
                      </View>

                      <Text
                        className="text-[20px] "
                        style={{
                          color: textColor,
                          fontFamily: styles.text.fontFamily,
                        }}
                      >
                        R16 675
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: bg,
                    padding: styles.sections.padding,
                  }}
                  className="mt-2 "
                >
                  <View className=" flex-row items-center justify-between ">
                    <Text
                      className="text-[15px]  "
                      style={{
                        color: textColor,
                        fontFamily: styles.text.fontFamily,
                      }}
                    >
                      Previous Bids
                    </Text>
                  </View>
                  <View className="mt-[4%]   flex-row items-center justify-between ">
                    <View className="  h-[150px] ">
                      <ScrollView nestedScrollEnabled={true}>
                        <View
                          style={{
                            borderColor: textColor,
                            borderWidth: 2,
                            width: width - 35,
                          }}
                          className=" flex-row items-center p-2 justify-between  mb-3"
                        >
                          <View className="flex-row w-[200px] items-center gap-4">
                            <View
                              style={{
                                borderColor: textColor,
                                borderWidth: 2,
                              }}
                              className=" w-[25px] h-[25px]  rounded-sm"
                            ></View>
                            <Text
                              className="text-[15px]  "
                              style={{
                                color: textColor,
                                fontFamily: styles.text.fontFamily,
                              }}
                            >
                              Greg421
                            </Text>
                          </View>

                          <Text
                            className="text-[15px] "
                            style={{
                              color: textColor,
                              fontFamily: styles.text.fontFamily,
                            }}
                          >
                            R16475
                          </Text>
                        </View>
                        <View
                          style={{
                            borderColor: textColor,
                            borderWidth: 2,
                            width: width - 35,
                          }}
                          className=" flex-row items-center p-2 justify-between  mb-3"
                        >
                          <View className="flex-row w-[200px] items-center gap-4">
                            <View
                              style={{
                                borderColor: textColor,
                                borderWidth: 2,
                              }}
                              className=" w-[25px] h-[25px]  rounded-sm"
                            ></View>
                            <Text
                              className="text-[15px]  "
                              style={{
                                color: textColor,
                                fontFamily: styles.text.fontFamily,
                              }}
                            >
                              ThaB090
                            </Text>
                          </View>

                          <Text
                            className="text-[15px]  "
                            style={{
                              color: textColor,
                              fontFamily: styles.text.fontFamily,
                            }}
                          >
                            R16 175
                          </Text>
                        </View>
                        <View
                          style={{
                            borderColor: textColor,
                            borderWidth: 2,
                            width: width - 35,
                          }}
                          className=" flex-row items-center p-2 justify-between  mb-3"
                        >
                          <View className="flex-row w-[200px] items-center gap-4">
                            <View
                              style={{
                                borderColor: textColor,
                                borderWidth: 2,
                              }}
                              className=" w-[25px] h-[25px]  rounded-sm"
                            ></View>
                            <Text
                              className="text-[15px]  "
                              style={{
                                color: textColor,
                                fontFamily: styles.text.fontFamily,
                              }}
                            >
                              Mark
                            </Text>
                          </View>

                          <Text
                            className="text-[15px]  "
                            style={{
                              color: textColor,
                              fontFamily: styles.text.fontFamily,
                            }}
                          >
                            R14 675
                          </Text>
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                </View>
              </>
            ) : null}

            <View
              style={{ backgroundColor: bg, padding: styles.sections.padding }}
              className=" mt-2 "
            >
              <View className="   flex-row items-center ">
                <Text
                  className="text-[20px]  "
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  Description
                </Text>
              </View>
              <View className="mt-[3%]   flex-row items-center ">
                <Text
                  className="text-[13px] font-semibold "
                  style={[
                    { width: width - 45 },
                    { color: textColor, fontFamily: styles.text.fontFamily },
                  ]}
                >
                  {product.descriptions!!}
                </Text>
              </View>
            </View>

            {product.video ? (
              product.video.type === "web" ? (
                <>
                  <View
                    style={{
                      backgroundColor: bg,
                      padding: styles.sections.padding,
                    }}
                    className=" mt-2 "
                  >
                    <View className="  flex-row items-center ">
                      <Text
                        className="text-[20px] "
                        style={{
                          color: textColor,
                          fontFamily: styles.text.fontFamily,
                        }}
                      >
                        Video Preview
                      </Text>
                    </View>
                    <View className="mt-[5%]  px-4 flex-row items-center ">
                      <WebView
                        style={{ width: width - 45, height: 200 }}
                        source={{
                          uri: Video,
                        }}
                      ></WebView>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={{
                      backgroundColor: bg,
                      padding: styles.sections.padding,
                    }}
                    className=" mt-2 "
                  >
                    <View className="    flex-row items-center ">
                      <Text
                        className="text-[20px] "
                        style={{
                          color: textColor,
                          fontFamily: styles.text.fontFamily,
                        }}
                      >
                        Video Preview
                      </Text>
                    </View>
                    <VideoView
                      className="mt-[8%]"
                      allowsFullscreen
                      allowsPictureInPicture
                      nativeControls
                      style={{
                        alignSelf: "center",
                        marginTop: 18,
                        height: 250,
                        width: 300,
                      }}
                      player={player}
                    />
                  </View>
                </>
              )
            ) : null}

            <View
              style={{ backgroundColor: bg, padding: styles.sections.padding }}
              className=" mt-2 "
            >
              <View className=" flex-row items-center ">
                <Text
                  className="text-[20px]  "
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  Product Information
                </Text>
              </View>
              <View className="mt-[5%]   flex-row items-center ">
                <Table
                  borderStyle={{
                    borderWidth: 1,
                    borderColor: appTheme.colors?.tertiary,
                  }}
                >
                  <TableWrapper
                    borderStyle={{ borderColor: "red" }}
                    style={{ flexDirection: "row" }}
                  >
                    <Col
                      heightArr={ArrHeight}
                      width={120}
                      textStyle={{
                        ...{
                          color: textColor,
                          fontFamily: styles.text.fontFamily,
                        },
                        padding: 5,
                      }}
                      data={tableData.property}
                    />
                    <Col
                      data={tableData.info}
                      heightArr={ArrHeight}
                      width={width - 140}
                      textStyle={{
                        ...{
                          color: textColor,
                          fontFamily: styles.text.fontFamily,
                        },
                        padding: 5,
                      }}
                    />
                  </TableWrapper>
                </Table>
              </View>
            </View>
            <View
              style={{ backgroundColor: bg, padding: styles.sections.padding }}
              className="mt-2 "
            >
              <View className="  mt-3  flex-row items-center  ">
                <Text
                  className="text-[34px]  w-[55px]"
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  {product.rating}
                </Text>
                {/* <StarRating
                  color={textColor}
                  rating={
                    Number.isInteger(product.rating)
                      ? product.rating!!
                      : parseFloat(`${product.rating?.toString().charAt(0)}.5`)
                  }
                  onChange={() => {}}
                  animationConfig={{ scale: 1 }}
                /> */}

                <StarRating
                  color={textColor}
                  rating={
                    Number.isInteger(product.rating)
                      ? product.rating!!
                      : parseFloat(`${product.rating?.toString().charAt(0)}.5`)
                  }
                  onChange={() => {}}
                  animationConfig={{ scale: 1 }}
                />
              </View>
              <View className="mt-2   flex-row items-center gap-5">
                <View className=" flex-row gap-1 items-center">
                  <Text
                    className="text-[20px]  "
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    5
                  </Text>
                  <Feather name="star" size={12} style={{ color: textColor }} />
                </View>

                <Progress.Bar
                  height={9}
                  borderRadius={4}
                  borderWidth={0}
                  color={textColor}
                  progress={ReviewStarsInfo[4].star.perc}
                  unfilledColor={appTheme.colors?.background}
                  width={200}
                />
                <Text
                  className="text-[17px]  "
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  {ReviewStarsInfo[4].star.num_of_people}
                </Text>
              </View>
              <View className="mt-[3%]   flex-row items-center gap-5">
                <View className=" flex-row gap-1 items-center">
                  <Text
                    className="text-[20px] "
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    4
                  </Text>
                  <Feather name="star" size={12} style={{ color: textColor }} />
                </View>

                <Progress.Bar
                  height={9}
                  borderRadius={4}
                  borderWidth={0}
                  color={textColor}
                  progress={ReviewStarsInfo[3].star.perc}
                  unfilledColor={appTheme.colors?.background}
                  width={200}
                />
                <Text
                  className="text-[17px]  "
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  {ReviewStarsInfo[3].star.num_of_people}
                </Text>
              </View>
              <View className="mt-[3%]  flex-row items-center gap-5">
                <View className=" flex-row gap-1 items-center">
                  <Text
                    className="text-[20px]"
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    3
                  </Text>
                  <Feather name="star" size={12} style={{ color: textColor }} />
                </View>

                <Progress.Bar
                  height={9}
                  borderRadius={4}
                  borderWidth={0}
                  color={textColor}
                  progress={ReviewStarsInfo[2].star.perc}
                  unfilledColor={appTheme.colors?.background}
                  width={200}
                />
                <Text
                  className="text-[17px]  "
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  {ReviewStarsInfo[2].star.num_of_people}
                </Text>
              </View>
              <View className="mt-[3%]   flex-row items-center gap-5">
                <View className=" flex-row gap-1 items-center">
                  <Text
                    className="text-[20px] "
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    2
                  </Text>
                  <Feather name="star" size={12} style={{ color: textColor }} />
                </View>

                <Progress.Bar
                  height={9}
                  borderRadius={4}
                  borderWidth={0}
                  color={textColor}
                  progress={ReviewStarsInfo[1].star.perc}
                  unfilledColor={appTheme.colors?.background}
                  width={200}
                />
                <Text
                  className="text-[17px]  "
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  {ReviewStarsInfo[1].star.num_of_people}
                </Text>
              </View>
              <View className="mt-[3%]  flex-row items-center gap-5">
                <View className=" flex-row gap-1 items-center">
                  <Text
                    className="text-[20px]  "
                    style={{
                      color: textColor,
                      fontFamily: styles.text.fontFamily,
                    }}
                  >
                    1
                  </Text>
                  <Feather name="star" size={12} style={{ color: textColor }} />
                </View>

                <Progress.Bar
                  height={9}
                  borderRadius={4}
                  borderWidth={0}
                  color={textColor}
                  progress={ReviewStarsInfo[0].star.perc}
                  unfilledColor={appTheme.colors?.background}
                  width={200}
                />
                <Text
                  className="text-[17px]  "
                  style={{
                    color: textColor,
                    fontFamily: styles.text.fontFamily,
                  }}
                >
                  {ReviewStarsInfo[0].star.num_of_people}
                </Text>
              </View>
            </View>
          </View>
        )}
        data={product.reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{ backgroundColor: bg, padding: styles.sections.padding }}
            className="  mt-2  "
          >
            <Text
              style={{ color: textColor, fontFamily: styles.text.fontFamily }}
              className="text-[24px]  w-[250px]"
            >
              {item.Title}
            </Text>

            <View className="-left-2 mt-[2%]">
              <StarRating
                color={textColor}
                starSize={15}
                rating={item.rating}
                onChange={() => {}}
                animationConfig={{ scale: 1 }}
              />
            </View>
            <View className="flex-row gap-1 mt-[2%]">
              <Text
                className="text-[15px] "
                style={{ color: textColor, fontFamily: styles.text.fontFamily }}
              >
                {item.name} -
              </Text>
              <Text
                className="text-[15px] "
                style={{ color: textColor, fontFamily: styles.text.fontFamily }}
              >
                {/* {item.date && item.date.toUTCString().substring(0, 16)} */}
                {String(item.date)}
              </Text>
            </View>
            <Text
              style={{ color: textColor, fontFamily: styles.text.fontFamily }}
              className="mt-[2%] w-[290px]"
            >
              {item.content}
            </Text>
            <View
              style={{
                borderColor: textColor,
                borderWidth: 1,
              }}
              className="rounded-[69px] mt-[5%] p-2 items-center flex-row gap-2 w-[70px] self-end "
            >
              <AntDesign name="like1" size={16} style={{ color: textColor }} />
              <Text className="text-[15px] " style={{ color: textColor }}>
                ({item.likes})
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
});

export default ViewProduct;
