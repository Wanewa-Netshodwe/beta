import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Screen from "../../utilities/Screen";
import * as ImagePicker from "expo-image-picker";
import {
  bid,
  bids,
  product,
  reviews,
  TabParamList,
} from "../../utilities/Types";
import { useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import WebView from "react-native-webview";
import { SelectList } from "react-native-dropdown-select-list";
import { RadioGroup } from "react-native-radio-buttons-group";
import { BE_addProduct } from "../../backend/Queries";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useStates } from "../../utilities/States";
import { useDynamicStyles } from "../../utilities/Styles";
import OutlineBtn from "../../components/OutlineBtn";
import ClickableBtn from "../../components/ClickableBtn";
import AddingProductModal from "../../components/AddingProductModal";
import { useFocusEffect } from "@react-navigation/native";

type Props = BottomTabScreenProps<TabParamList, "addProduct">;
const AddProduct: React.FC<Props> = ({ navigation }) => {
  console.log("add produc scrren called");
  const { CategoryListState } = useStates();

  const styles = useDynamicStyles();
  const { appTheme, businessSections } = useStates();
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const businessData = businessSections;
  const [rowData, setRowData] = useState([0]);

  let [inputs, setInputs] = useState<{ property?: string; info?: string }[]>(
    []
  );
  const dispatch = useDispatch();
  const [img, setImg] = useState<string[]>([]);
  const [Video, setVideo] = useState("");
  const [webVideo, setWebVideo] = useState("");
  const [closingdate, setClosingDate] = useState<string>();
  const [openingdate, setOpeningDate] = useState<string>();
  const [startPrice, setStartPrice] = useState("");
  const [incrementPrice, setIncrementPrice] = useState("");
  const [auction, setAuction] = useState("no");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [deliverPrice, setDeliveryPrice] = useState("");
  const [description, setDescription] = useState("");
  const [section, setSection] = useState("");
  const [counter, setCounter] = useState(1);
  const [delivery, setDelivery] = useState("yes");
  const [quantity, setQuantity] = useState("");
  const [vd1, setvd1] = useState(true);
  const [vd2, setvd2] = useState(true);
  const createRandomId = useCallback(() => {
    return Math.random().toString(36).substring(2, 27);
  }, []);
  let dataDummy: { key: string; value: string }[] = [];
  let categoryData: { key: string; value: string }[] = [];

  businessData.map((item) => {
    if (dataDummy) {
      if (item.type === "Section") {
        dataDummy.push({ key: item.name, value: item.name });
      }
    }
  });

  CategoryListState.SectionList.map((item) => {
    if (item.categoryList?.categories)
      item.categoryList?.categories.map((category) => {
        categoryData.push({
          key: category.name!!,
          value: category.name!!,
        });
      });
  });

  const validateDate1 = (date: Date) => {
    const currentDate = new Date();
    if (currentDate > date) {
      setvd1(false);
    } else {
      setvd1(true);
    }
  };
  const validateDate2 = (date: Date) => {
    const currentDate = new Date();
    if (currentDate > date) {
      setvd2(false);
    } else {
      setvd2(true);
    }
  };
  const [visible, setVisible] = useState({ opening: false, closing: false });
  const convertToGMT2 = (date: Date) => {
    let newDate = "";
    const offsetMinutes = 120;
    const MillisecondTime = date.getTime();
    const d = new Date(MillisecondTime + offsetMinutes * 60 * 1000);
    newDate = d.toUTCString();
    return newDate;
  };
  const radioButtons = useMemo(
    () => [
      {
        id: "yes",
        label: "Yes",
        value: "yes",
      },
      {
        id: "no",
        label: "No",
        value: "no",
      },
    ],
    []
  );
  const radioButtons2 = useMemo(
    () => [
      {
        id: "yes",
        label: "Yes",
        value: "yes",
      },
      {
        id: "no",
        label: "No",
        value: "no",
      },
    ],
    []
  );
  const player = useVideoPlayer(Video, (player) => {
    if (Video) {
      player.pause();
      player.audioMixingMode = "doNotMix";
    }
  });
  const handleRowDelete = (index: number) => {
    setD((prev) => {
      let updatedrows = [...prev];
      updatedrows.splice(index, 1);
      return updatedrows;
    });
    setInputs((prev) => {
      let updatedInputs = [...prev];
      updatedInputs.splice(index, 1);
      return updatedInputs;
    });
  };
  const handleProductInfo = (text: string, index: number, type: string) => {
    setInputs((prev) => {
      const updatedInputs = [...prev]; // Create a copy of the current state
      if (type === "property") {
        updatedInputs[index] = { ...updatedInputs[index], property: text }; // Update the "property" field
      } else if (type === "info") {
        updatedInputs[index] = { ...updatedInputs[index], info: text }; // Update the "info" field
      }
      return updatedInputs; // Return the updated state
    });
  };
  const handleAddProduct = () => {
    let sum = 0;
    const r = reviews;
    r.map((item) => {
      sum += item.rating;
    });
    const rating = sum / r.length;

    let max: number = 0;
    for (let i = 0; i < bids.length - 1; i++) {
      max = Math.max(bids[i].bid!!, bids[i + 1].bid!!);
    }
    let bidWinner = bids.filter((bid) => {
      if (bid.bid === max) {
        return bid;
      }
    });

    const sectionInfo: product = {
      id: createRandomId(),
      delivery_cost: Number(deliverPrice),
      descriptions: description,
      free_delivery: delivery,
      imgs: img,
      name: name,
      rating: rating,
      ...(category ? { category: category } : {}),
      reviews: r,
      ...(auction === "yes"
        ? {
            auction: {
              startPrice: Number(startPrice),
              openingDate: openingdate,
              closingDate: closingdate,
              bidIncrement: Number(incrementPrice),
              bidders: bids,
              bidWinner: bidWinner[0],
              bidPrice: max,
            },
          }
        : { price: Number(price) }),
      product_info: inputs,
      quantity: Number(quantity),
      section: section,
      ...(webVideo.length > 15 || Video.length > 15
        ? {
            video: {
              type: webVideo ? "web" : "upload",
              uri: webVideo ? webVideo : Video,
            },
          }
        : {}),
    };
    // console.log("product: ", sectionInfo);

    BE_addProduct({
      dispatch,
      sectionInfo,
      navigator: navigation,
      loading: setLoading,
    });
  };
  const handleImageUpload = async () => {
    setImg([]);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this   work!");
      return;
    }
    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      // aspect: [16, 9],
      quality: 1,
    });

    if (!data.canceled) {
      let uris: string[] = [];
      data.assets.map((img) => {
        uris.push(img.uri);
      });

      setImg((prev) => [...prev, ...uris]);
    }
  };
  const handleVideoUpload = async () => {
    setWebVideo("");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this   work!");
      return;
    }
    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 120,
    });

    if (!data.canceled) {
      setVideo(data.assets[0].uri);
    }
  };
  const ScrollViewref = useRef(null);
  const addRow = () => {
    setRowData((prev) => [...prev, counter]);
    setCounter((prev) => prev + 1);
    //@ts-ignore
    ScrollViewref.current?.scrollToEnd({ animated: true });
  };

  return (
    <View
      style={{ backgroundColor: appTheme.colors?.background }}
      className="w-full h-full  "
    >
      {loading && (
        <Modal>
          <AddingProductModal />
        </Modal>
      )}

      <View style={styles.sections}>
        <Text style={styles.text} className={`text-[24px] `}>
          Add Product
        </Text>
      </View>
      <ScrollView>
        <DateTimePickerModal
          isVisible={visible.closing}
          mode="datetime"
          onConfirm={(time) => {
            setClosingDate(convertToGMT2(time));
            validateDate1(time);
            setVisible({ ...visible, closing: false });
          }}
          onCancel={() => setVisible({ ...visible, closing: false })}
        />
        <DateTimePickerModal
          isVisible={visible.opening}
          mode="datetime"
          onConfirm={(time) => {
            setOpeningDate(convertToGMT2(time));
            validateDate2(time);
            setVisible({ ...visible, opening: false });
          }}
          onCancel={() => setVisible({ ...visible, opening: false })}
        />
        <View style={styles.sections} className="mt-2">
          <View>
            <Text style={styles.text} className="text-[18px] ">
              Name
            </Text>
          </View>
          <View>
            <TextInput
              placeholderTextColor={appTheme.colors?.textColor}
              placeholder="Product Name"
              multiline
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
              style={[
                {
                  borderBottomColor: appTheme.colors?.background,
                  borderBottomWidth: 2,
                  backgroundColor: "transparent",
                },
                styles.text,
              ]}
              className=" rounded-sm py-3 font-semibold w-[70%] "
            ></TextInput>
          </View>
        </View>
        <View
          style={styles.sections}
          className="   mt-2 flex-row gap-3 items-center"
        >
          <TouchableNativeFeedback
            onPress={() => {
              handleImageUpload();
            }}
          >
            <View
              className="bg-transparent rounded-md p-2 w-fit"
              style={{
                borderColor: appTheme.colors?.textColor,
                borderWidth: 2,
              }}
            >
              <Text style={styles.text}>Upload Images</Text>
            </View>
          </TouchableNativeFeedback>
          <Text
            style={styles.text}
            className="text-[10px] font-semibold w-[150px] "
          >
            nb : the first picture would be the cover picture
          </Text>
        </View>

        <View style={styles.sections} className="mt-2">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Images Preview
            </Text>
          </View>
          <View className="mt-[5%] w-[290px] ">
            {img.length > 0 ? (
              <>
                <FlatList
                  horizontal
                  data={img}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Image
                      key={img.toString()}
                      width={320}
                      height={220}
                      borderRadius={1}
                      style={{ marginRight: 2 }}
                      source={{
                        uri: item,
                      }}
                    />
                  )}
                />
              </>
            ) : (
              <>
                <View
                  style={{
                    backgroundColor: appTheme.colors?.background,
                  }}
                  className=" rounded-sm py-14 w-[100%] h-[200px] "
                ></View>
              </>
            )}
          </View>
        </View>
        <View style={styles.sections} className="mt-2">
          <View>
            <Text
              style={styles.text}
              className="text-[18px] font-semibold w-[220px]"
            >
              Video url (optional)
            </Text>
          </View>
          <View className="mt-[5%] flex-row items-center gap-5 ">
            <TextInput
              placeholder="Video url"
              placeholderTextColor={appTheme.colors?.textColor}
              value={webVideo}
              onChangeText={(text) => {
                setWebVideo(text);
                setVideo("");
              }}
              style={styles.inputs}
              className=" rounded-sm py-3 w-[60%] "
            ></TextInput>
            <OutlineBtn onPress={handleVideoUpload} title="Upload Video" />
          </View>
        </View>
        <View style={styles.sections} className="mt-2">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Video Preview
            </Text>
          </View>
          <View className="mt-[5%] w-[280px]">
            {webVideo || Video ? (
              <>
                {Video ? (
                  <VideoView
                    allowsFullscreen
                    allowsPictureInPicture
                    nativeControls
                    style={{
                      height: 250,
                      width: 300,
                    }}
                    player={player}
                  />
                ) : (
                  <WebView
                    source={{ uri: webVideo }}
                    style={{ width: 290, height: 210 }}
                  />
                )}
              </>
            ) : (
              <View
                style={{
                  backgroundColor: appTheme.colors?.primary,
                }}
                className="rounded-sm py-14 w-full h-[200px] justify-center items-center"
              >
                <Text style={styles.text}>
                  No video loaded. Please enter a valid URL or upload a video
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sections} className="mt-2">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Auction
            </Text>
          </View>
          <View className="mt-[5%]">
            <RadioGroup
              layout="row"
              labelStyle={styles.text}
              radioButtons={radioButtons2}
              onPress={(s) => {
                setAuction(s);
              }}
              selectedId={auction}
            />
          </View>
        </View>
        {auction === "yes" ? (
          <>
            <View style={styles.sections} className="mt-2">
              <View>
                <Text style={styles.text} className="text-[18px] font-semibold">
                  Start Price
                </Text>
              </View>
              <View className="mt-[5%]">
                <TextInput
                  keyboardType="numeric"
                  value={startPrice}
                  onChangeText={(text) => {
                    setStartPrice(text);
                  }}
                  placeholder="0"
                  placeholderTextColor={appTheme.colors?.textColor}
                  style={styles.inputs}
                  className=" rounded-sm py-3 font-semibold w-[30%] "
                ></TextInput>
              </View>
            </View>

            <View style={styles.sections} className="mt-2">
              <View>
                <Text style={styles.text} className="text-[18px] font-semibold">
                  Auction Increment Price
                </Text>
              </View>
              <View className="mt-[5%]">
                <TextInput
                  placeholder="0"
                  placeholderTextColor={appTheme.colors?.textColor}
                  keyboardType="numeric"
                  value={incrementPrice}
                  onChangeText={(text) => {
                    setIncrementPrice(text);
                  }}
                  style={styles.inputs}
                  className=" rounded-sm py-3 font-semibold w-[30%] "
                ></TextInput>
              </View>
            </View>

            <View style={styles.sections} className="mt-2">
              <View>
                <Text style={styles.text} className="text-[18px] font-semibold">
                  Auction Start Date
                </Text>
              </View>
              <View className="mt-[5%]">
                <TouchableOpacity
                  onPress={() => {
                    setVisible({ ...visible, opening: true });
                  }}
                >
                  <TextInput
                    editable={false}
                    value={openingdate}
                    style={[
                      {
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderColor: vd1 ? appTheme.colors?.background : "red",
                      },
                      styles.text,
                    ]}
                    className=" rounded-sm py-3 w-[80%] "
                  ></TextInput>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.sections} className="mt-2">
              <View>
                <Text style={styles.text} className="text-[18px] font-semibold">
                  Auction Close Date
                </Text>
              </View>
              <View className="mt-[5%]">
                <TouchableOpacity
                  onPress={() => {
                    setVisible({ ...visible, closing: true });
                  }}
                >
                  <TextInput
                    editable={false}
                    value={closingdate}
                    style={[
                      {
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderColor: vd1 ? appTheme.colors?.background : "red",
                      },
                      styles.text,
                    ]}
                    className=" rounded-sm py-3 w-[80%] "
                  ></TextInput>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.sections} className="mt-2">
            <View>
              <Text style={styles.text} className="text-[18px] font-semibold">
                Price
              </Text>
            </View>
            <View className="">
              <TextInput
                value={price}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setPrice(text);
                }}
                style={styles.inputs}
                className=" rounded-sm py-3 font-semibold w-[30%] "
              ></TextInput>
            </View>
          </View>
        )}

        <View style={styles.sections} className="mt-2">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Quantity
            </Text>
          </View>
          <View>
            <TextInput
              keyboardType="numeric"
              value={quantity}
              onChangeText={(text) => {
                setQuantity(text);
              }}
              style={styles.inputs}
              className=" rounded-sm py-3 font-semibold w-[30%] "
            ></TextInput>
          </View>
        </View>
        {categoryData.length > 0 && (
          <View style={styles.sections} className="mt-2">
            <View>
              <Text style={styles.text} className="text-[18px] font-semibold">
                Category
              </Text>
            </View>
            <View className="mt-[5%]">
              <SelectList
                setSelected={(s: string) => {
                  setCategory(s);
                }}
                data={categoryData}
                save="value"
                inputStyles={styles.text}
                dropdownTextStyles={styles.text}
                placeholder="Choose Product Section"
                search={false}
              />
            </View>
          </View>
        )}
        <View style={styles.sections} className="mt-2">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Description
            </Text>
          </View>
          <View className="mt-[5%]">
            <TextInput
              placeholder="Write Description"
              placeholderTextColor={appTheme.colors?.textColor}
              value={description}
              multiline
              onChangeText={(text) => {
                setDescription(text);
              }}
              style={styles.inputs}
              className=" rounded-sm py-3 font-semibold w-[80%] "
            ></TextInput>
          </View>
        </View>
        <View style={styles.sections} className="mt-2">
          <View>
            <Text style={styles.text} className="text-[18px] ">
              Infomation
            </Text>
          </View>
          <View className="mt-[5%]">
            <View
              style={{
                backgroundColor: appTheme.colors?.primary,
              }}
              className=" rounded-sm  overflow-hidden py-3 h-[300px] w-[98%] relative "
            >
              <View
                style={{ backgroundColor: appTheme.colors?.background }}
                className="absolute p-2 left-0 top-0 w-full flex-row"
              >
                <Text
                  className=" w-[35%]  relative left-3   text-[18px]"
                  style={styles.text}
                >
                  Property
                </Text>
                <Text
                  className=" w-[65%] relative left-3    text-[18px]"
                  style={styles.text}
                >
                  Information
                </Text>
              </View>
              <View className="mt-7 p-1  h-[210px]  ">
                <ScrollView nestedScrollEnabled={true} ref={ScrollViewref}>
                  {rowData.map((_, index) => (
                    <View key={index} className=" flex-row  mt-2 ">
                      <View
                        style={{
                          borderColor: appTheme.colors?.textColor,
                          borderWidth: 2,
                        }}
                        className=" w-[35%] border-r-0  "
                      >
                        <TextInput
                          multiline
                          style={styles.text}
                          className="w-full  h-fit  font-semibold text-[14px]"
                          onChangeText={(text) => {
                            handleProductInfo(text, index, "property");
                          }}
                        />
                      </View>
                      <View
                        style={{
                          borderColor: appTheme.colors?.textColor,
                          borderWidth: 2,
                        }}
                        className=" w-[65%]  relative"
                      >
                        <AntDesign
                          onPress={() => {
                            handleRowDelete(index);
                          }}
                          size={20}
                          style={{ color: appTheme.colors?.textColor }}
                          className="absolute z-40 right-1 top-3 "
                          name="delete"
                        />
                        <TextInput
                          multiline
                          style={styles.text}
                          onChangeText={(text) => {
                            handleProductInfo(text, index, "info");
                          }}
                          className="w-[85%] h-fit  font-semibold text-[14px] "
                        />
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View className="mt-2 left-2">
                <OutlineBtn title="Add row" width={120} onPress={addRow} />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sections} className="mt-2">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Section
            </Text>
          </View>
          <View className="mt-[5%]">
            <SelectList
              setSelected={(s: string) => {
                setSection(s);
              }}
              data={dataDummy}
              save="value"
              inputStyles={styles.text}
              dropdownTextStyles={styles.text}
              placeholder="Choose Product Section"
              search={false}
            />
          </View>
        </View>
        <View style={styles.sections} className="mt-2">
          <View>
            <Text style={styles.text} className="text-[18px] font-semibold">
              Free Delivery
            </Text>
          </View>
          <View className="mt-[5%]">
            <RadioGroup
              layout="row"
              labelStyle={styles.text}
              radioButtons={radioButtons}
              onPress={(s) => {
                setDelivery(s);
              }}
              selectedId={delivery}
            />
          </View>
        </View>
        {delivery === "yes" ? null : (
          <View style={styles.sections} className="mt-2">
            <View>
              <Text style={styles.text} className="text-[18px] font-semibold">
                Delivery Cost
              </Text>
            </View>
            <View>
              <TextInput
                value={deliverPrice}
                onChangeText={(text) => {
                  setDeliveryPrice(text);
                }}
                keyboardType="numeric"
                style={styles.inputs}
                className=" rounded-sm font-semibold py-3 w-[30%] "
              ></TextInput>
            </View>
          </View>
        )}

        <View className=" flex-row  p-[5%] justify-between">
          <ClickableBtn onPress={handleAddProduct} title="Save" />
          <ClickableBtn
            width={125}
            onPress={() => {
              navigation.navigate("Layout");
            }}
            title="Cancel"
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default memo(AddProduct);
