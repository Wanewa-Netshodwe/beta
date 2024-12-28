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
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Screen from "../../utilities/Screen";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import WebView from "react-native-webview";
import {
  Table,
  Col,
  Row,
  TableWrapper,
  Rows,
} from "react-native-table-component";
import StarRating from "react-native-star-rating-widget";
import * as Progress from "react-native-progress";
import {
  reviews,
  StackShopLayoutParamList,
  TabParamList,
} from "../../utilities/Types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useVideoPlayer, VideoView } from "expo-video";
import Carousel from "react-native-reanimated-carousel";
import { useStates } from "../../utilities/States";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { useDynamicStyles } from "../../utilities/Styles";

type Props = BottomTabScreenProps<StackShopLayoutParamList, "viewProduct">;

const ViewProduct: React.FC<Props> = ({ route }) => {
  const styles = useDynamicStyles();
  const { product } = route.params;
  const [Video, setVideo] = useState("");
  const [loading, setLoading] = useState(true);
  const [ReviewStarsInfo, setReviewStarsInfo] = useState<
    {
      star: {
        value: number;
        num_of_people: number;
        perc: number;
      };
    }[]
  >([]);
  const [ArrHeight, setArrHeight] = useState<number[]>([]);
  const [tableData, setTableData] = useState<{
    info: string[];
    property: string[];
  }>({
    info: [],
    property: [],
  });

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
    console.log(starsInfo);

    setReviewStarsInfo(starsInfo);
    setLoading(false);
  }, []);

  const player = useVideoPlayer(Video, (player) => {
    player.pause();
  });

  const [bidPrice, setBidPrice] = useState("16765");
  const currentPrice = 16765;

  const [visible, setVisible] = useState(false);
  const validPrice = () => {
    const num = Number(bidPrice);
    if (num < currentPrice || num - currentPrice < 90) {
      console.log("invalid ");
    } else {
      console.log("valid");
    }
  };
  const { width } = Dimensions.get("screen");
  const { appTheme } = useStates();

  if (loading) {
    return <Text>Loading</Text>;
  }

  return (
    <View className="relative">
      <View
        style={styles.sections}
        className="   p-[2%] gap-5 flex-row items-center "
      >
        <MaterialIcons
          name="arrow-back-ios-new"
          size={20}
          style={{ color: appTheme.colors?.textColor }}
        />
        <Text style={styles.text} className=" top-2 text-[15px] ">
          {product.name}
        </Text>
      </View>
      <ScrollView>
        <View
          style={{ width: width, backgroundColor: appTheme.colors?.primary }}
          className="mt-1"
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
                renderItem={({ item }) => (
                  <Image
                    key={item.toString()}
                    source={{ uri: item }}
                    width={width - 5}
                    height={250}
                  />
                )}
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
        <View style={styles.sections} className=" ">
          <View className="  ">
            <Text className="text-[20px] font-semibold" style={styles.text}>
              {product.name!!}
            </Text>
          </View>
          {product.rating ? (
            <>
              <View className=" mt-2  flex-row items-center">
                <Feather
                  name="star"
                  size={16}
                  style={{ color: appTheme.colors.tertiary }}
                  className="w-[20px]"
                />
                <Text
                  className="text-[14px] font-semibold w-[25px]"
                  style={styles.text}
                >
                  {product.rating}
                </Text>
                <Text className="text-[14px] font-semibold" style={styles.text}>
                  {product.reviews?.length!!} REVIEWS
                </Text>
              </View>
            </>
          ) : null}
        </View>

        <View
          style={styles.sections}
          className=" mt-1   flex-row items-center justify-between "
        >
          <Text className="text-[34px]  w-fit" style={styles.text}>
            R{" "}
            {product.auction
              ? product.auction.started
                ? product.auction.bidPrice
                : product.auction.startPrice
              : product.price}
          </Text>
          <View className="mr-4 items-end">
            <Text className="text-[12px] font-semibold" style={styles.text}>
              delivery cost
            </Text>
            <Text className="text-[14px]  " style={styles.text}>
              R{product.delivery_cost ? product.delivery_cost : "0"}
            </Text>
          </View>
        </View>
        {product.auction ? (
          <>
            <View
              style={styles.sections}
              className="mt-2   flex-row items-center justify-between "
            >
              <View className="mr-4 gap-1">
                <Text
                  className="text-[12px] font-semibold "
                  style={styles.text}
                >
                  Start Date
                </Text>
                <Text className="text-[14px] " style={styles.text}>
                  12/12/2024 00:00
                </Text>
              </View>
            </View>
          </>
        ) : null}
        {product.auction ? (
          <View
            style={styles.sections}
            className="mt-2  px-4 flex-row items-center justify-between "
          >
            <View className="mr-4 gap-1">
              <Text className="text-[12px] font-semibold " style={styles.text}>
                Closing Date
              </Text>
              <Text className="text-[14px] font-extrabold " style={styles.text}>
                17/12/2024 16:30
              </Text>
            </View>
            <View className="mr-4 items-end">
              <Text className="text-[12px] font-semibold" style={styles.text}>
                bid increment
              </Text>
              <Text className="text-[14px] font-bold " style={styles.text}>
                R90
              </Text>
            </View>
          </View>
        ) : null}

        <View
          style={styles.sections}
          className="mt-2    flex-row items-center justify-between "
        >
          <View
            style={{ borderColor: appTheme.colors?.textColor, borderWidth: 2 }}
            className="p-2 items-center"
          >
            <Text className="text-[23px]  " style={styles.text}>
              {product.auction
                ? `Bid R${
                    product.auction.bidPrice!! + product.auction.bidIncrement!!
                  }`
                : `Buy R${product.price}`}
            </Text>
          </View>
          {product.auction ? (
            <View className="mr-4 flex-row gap-9">
              <Feather
                name="edit"
                size={30}
                style={{ color: appTheme.colors.tertiary }}
                onPress={() => {
                  setVisible(!visible);
                }}
              />
            </View>
          ) : null}
        </View>
        {product.auction ? (
          <>
            <View style={styles.sections} className="mt-2 ">
              <View className="  flex-row items-center ">
                <Text className="text-[20px]  " style={styles.text}>
                  Winning Bid
                </Text>
              </View>
              <View className="mt-[4%]   flex-row items-center justify-between ">
                <View
                  style={{
                    borderColor: appTheme.colors?.textColor,
                    borderWidth: 2,
                    width: width - 35,
                  }}
                  className=" flex-row items-center p-2 "
                >
                  <View className="flex-row w-[200px] items-center gap-4">
                    <View
                      style={{
                        borderColor: appTheme.colors.tertiary,
                        borderWidth: 2,
                      }}
                      className=" w-[35px] h-[35px]  rounded-sm"
                    ></View>
                    <Text className="text-[20px]  " style={styles.text}>
                      Stanley
                    </Text>
                  </View>

                  <Text className="text-[20px] " style={styles.text}>
                    R16 675
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.sections} className="mt-2 ">
              <View className=" flex-row items-center justify-between ">
                <Text className="text-[15px]  " style={styles.text}>
                  Previous Bids
                </Text>
              </View>
              <View className="mt-[4%]   flex-row items-center justify-between ">
                <View className="  h-[150px] ">
                  <ScrollView nestedScrollEnabled={true}>
                    <View
                      style={{
                        borderColor: appTheme.colors?.textColor,
                        borderWidth: 2,
                        width: width - 35,
                      }}
                      className=" flex-row items-center p-2 justify-between  mb-3"
                    >
                      <View className="flex-row w-[200px] items-center gap-4">
                        <View
                          style={{
                            borderColor: appTheme.colors?.textColor,
                            borderWidth: 2,
                          }}
                          className=" w-[25px] h-[25px]  rounded-sm"
                        ></View>
                        <Text className="text-[15px]  " style={styles.text}>
                          Greg421
                        </Text>
                      </View>

                      <Text className="text-[15px] " style={styles.text}>
                        R16475
                      </Text>
                    </View>
                    <View
                      style={{
                        borderColor: appTheme.colors?.textColor,
                        borderWidth: 2,
                        width: width - 35,
                      }}
                      className=" flex-row items-center p-2 justify-between  mb-3"
                    >
                      <View className="flex-row w-[200px] items-center gap-4">
                        <View
                          style={{
                            borderColor: appTheme.colors?.textColor,
                            borderWidth: 2,
                          }}
                          className=" w-[25px] h-[25px]  rounded-sm"
                        ></View>
                        <Text className="text-[15px]  " style={styles.text}>
                          ThaB090
                        </Text>
                      </View>

                      <Text className="text-[15px]  " style={styles.text}>
                        R16 175
                      </Text>
                    </View>
                    <View
                      style={{
                        borderColor: appTheme.colors?.textColor,
                        borderWidth: 2,
                        width: width - 35,
                      }}
                      className=" flex-row items-center p-2 justify-between  mb-3"
                    >
                      <View className="flex-row w-[200px] items-center gap-4">
                        <View
                          style={{
                            borderColor: appTheme.colors?.textColor,
                            borderWidth: 2,
                          }}
                          className=" w-[25px] h-[25px]  rounded-sm"
                        ></View>
                        <Text className="text-[15px]  " style={styles.text}>
                          Mark
                        </Text>
                      </View>

                      <Text className="text-[15px]  " style={styles.text}>
                        R14 675
                      </Text>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.sections} className=" mt-2 ">
          <View className="   flex-row items-center ">
            <Text className="text-[20px]  " style={styles.text}>
              Description
            </Text>
          </View>
          <View className="mt-[3%]   flex-row items-center ">
            <Text
              className="text-[13px] font-semibold "
              style={[{ width: width - 45 }, styles.text]}
            >
              {product.descriptions!!}
            </Text>
          </View>
        </View>

        {product.video ? (
          product.video.type === "web" ? (
            <>
              <View style={styles.sections} className=" mt-2 ">
                <View className="  flex-row items-center ">
                  <Text className="text-[20px] " style={styles.text}>
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
              <View style={styles.sections} className=" mt-2 ">
                <View className="    flex-row items-center ">
                  <Text className="text-[20px] " style={styles.text}>
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

        <View style={styles.sections} className=" mt-2 ">
          <View className=" flex-row items-center ">
            <Text className="text-[20px]  " style={styles.text}>
              Product Information
            </Text>
          </View>
          <View className="mt-[5%]   flex-row items-center ">
            <Table
              borderStyle={{
                borderWidth: 1,
                borderColor: appTheme.colors.tertiary,
              }}
            >
              <TableWrapper
                borderStyle={{ borderColor: "red" }}
                style={{ flexDirection: "row" }}
              >
                <Col
                  heightArr={ArrHeight}
                  width={120}
                  textStyle={[styles.text, { padding: 5 }]}
                  data={tableData.property}
                />
                <Col
                  data={tableData.info}
                  heightArr={ArrHeight}
                  width={width - 140}
                  textStyle={[styles.text, { padding: 5 }]}
                />
              </TableWrapper>
            </Table>
          </View>
        </View>
        <View style={styles.sections} className="mt-2 ">
          <View className="  mt-3  flex-row items-center  ">
            <Text className="text-[34px]  w-[55px]" style={styles.text}>
              {product.rating}
            </Text>
            <StarRating
              color={appTheme.colors?.textColor}
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
              <Text className="text-[20px]  " style={styles.text}>
                5
              </Text>
              <Feather
                name="star"
                size={12}
                style={{ color: appTheme.colors?.textColor }}
              />
            </View>

            <Progress.Bar
              height={9}
              borderRadius={4}
              borderWidth={0}
              color={appTheme.colors?.textColor}
              progress={ReviewStarsInfo[4].star.perc}
              unfilledColor={appTheme.colors?.background}
              width={200}
            />
            <Text className="text-[17px]  " style={styles.text}>
              {ReviewStarsInfo[4].star.num_of_people}
            </Text>
          </View>
          <View className="mt-[3%]   flex-row items-center gap-5">
            <View className=" flex-row gap-1 items-center">
              <Text className="text-[20px] " style={styles.text}>
                4
              </Text>
              <Feather
                name="star"
                size={12}
                style={{ color: appTheme.colors?.textColor }}
              />
            </View>

            <Progress.Bar
              height={9}
              borderRadius={4}
              borderWidth={0}
              color={appTheme.colors?.textColor}
              progress={ReviewStarsInfo[3].star.perc}
              unfilledColor={appTheme.colors?.background}
              width={200}
            />
            <Text className="text-[17px]  " style={styles.text}>
              {ReviewStarsInfo[3].star.num_of_people}
            </Text>
          </View>
          <View className="mt-[3%]  flex-row items-center gap-5">
            <View className=" flex-row gap-1 items-center">
              <Text className="text-[20px]" style={styles.text}>
                3
              </Text>
              <Feather
                name="star"
                size={12}
                style={{ color: appTheme.colors?.textColor }}
              />
            </View>

            <Progress.Bar
              height={9}
              borderRadius={4}
              borderWidth={0}
              color={appTheme.colors?.textColor}
              progress={ReviewStarsInfo[2].star.perc}
              unfilledColor={appTheme.colors?.background}
              width={200}
            />
            <Text className="text-[17px]  " style={styles.text}>
              {ReviewStarsInfo[2].star.num_of_people}
            </Text>
          </View>
          <View className="mt-[3%]   flex-row items-center gap-5">
            <View className=" flex-row gap-1 items-center">
              <Text className="text-[20px] " style={styles.text}>
                2
              </Text>
              <Feather
                name="star"
                size={12}
                style={{ color: appTheme.colors?.textColor }}
              />
            </View>

            <Progress.Bar
              height={9}
              borderRadius={4}
              borderWidth={0}
              color={appTheme.colors?.textColor}
              progress={ReviewStarsInfo[1].star.perc}
              unfilledColor={appTheme.colors?.background}
              width={200}
            />
            <Text className="text-[17px]  " style={styles.text}>
              {ReviewStarsInfo[1].star.num_of_people}
            </Text>
          </View>
          <View className="mt-[3%]  flex-row items-center gap-5">
            <View className=" flex-row gap-1 items-center">
              <Text className="text-[20px]  " style={styles.text}>
                1
              </Text>
              <Feather
                name="star"
                size={12}
                style={{ color: appTheme.colors?.textColor }}
              />
            </View>

            <Progress.Bar
              height={9}
              borderRadius={4}
              borderWidth={0}
              color={appTheme.colors?.textColor}
              progress={ReviewStarsInfo[0].star.perc}
              unfilledColor={appTheme.colors?.background}
              width={200}
            />
            <Text className="text-[17px]  " style={styles.text}>
              {ReviewStarsInfo[0].star.num_of_people}
            </Text>
          </View>
        </View>

        <FlatList
          nestedScrollEnabled={true}
          data={product.reviews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.sections} className="  mt-2  ">
              <Text style={styles.text} className="text-[24px]  w-[250px]">
                {item.Title}
              </Text>

              <View className="-left-2 mt-[2%]">
                <StarRating
                  color={appTheme.colors?.textColor}
                  starSize={15}
                  rating={item.rating}
                  onChange={() => {}}
                  animationConfig={{ scale: 1 }}
                />
              </View>
              <View className="flex-row gap-1 mt-[2%]">
                <Text className="text-[15px] " style={styles.text}>
                  {item.name} -
                </Text>
                <Text className="text-[15px] " style={styles.text}>
                  {item.date.toUTCString().substring(0, 16)}
                </Text>
              </View>
              <Text style={styles.text} className="mt-[2%] w-[290px]">
                {item.content}
              </Text>
              <View
                style={{
                  borderColor: appTheme.colors?.textColor,
                  borderWidth: 1,
                }}
                className="rounded-[69px] mt-[5%] p-2 items-center flex-row gap-2 w-[70px] self-end "
              >
                <AntDesign
                  name="like1"
                  size={16}
                  style={{ color: appTheme.colors?.textColor }}
                />
                <Text
                  className="text-[15px] "
                  style={{ color: appTheme.colors?.textColor }}
                >
                  ({item.likes})
                </Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default ViewProduct;
