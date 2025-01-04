import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  ScrollView,
  Animated,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Screen from "../../utilities/Screen";
import * as ImagePicker from "expo-image-picker";
import Tooltip from "react-native-walkthrough-tooltip";
import {
  BusinessAccount,
  sectionData,
  StackSettingsParamList,
  StackShopLayoutParamList,
} from "../../utilities/Types";
import { useNavigation } from "expo-router";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";
import RadioGroup from "react-native-radio-buttons-group";
import { BE_addSection, BE_updateBusiness } from "../../backend/Queries";
import { SelectList } from "react-native-dropdown-select-list";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { useStates } from "../../utilities/States";
import { StackScreenProps } from "@react-navigation/stack";
import { useDynamicStyles } from "../../utilities/Styles";
import ClickableBtn from "../../components/ClickableBtn";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import fontMap from "../../utilities/fontMap";
import * as Font from "expo-font";
type Prop = StackScreenProps<StackSettingsParamList, "BusinessSetting">;
const BusinessSetting: React.FC<Prop> = ({ navigation }) => {
  const { appTheme, businessSections, businessId, businessState } = useStates();
  const [contentVisible, setContentVisible] = useState(false);
  const [selectedFont, setSelectedFont] = useState(
    appTheme.fonts?.primary || ""
  );
  const loadFont = async (fontName: string) => {
    if (fontMap[fontName]) {
      await Font.loadAsync({ [fontName]: fontMap[fontName] });
    }
  };
  useEffect(() => {
    if (selectedFont) {
      loadFont(selectedFont);
      setLoading(true);
    }
  }, [selectedFont]);
  const [visible, setVisible] = useState({ opening: false, closing: false });
  const styles2 = useDynamicStyles();
  const dispatch = useDispatch();
  const [openingTime, setOpeningTime] = useState(
    businessState.business_hours.opening
  );
  const [closingTime, setClosingTime] = useState(
    businessState.business_hours.closing
  );

  const businessData = businessSections;
  const [img, setImg] = useState(businessState.store_pic);
  const [Position, setPosition] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [name, setName] = useState(businessState.store_name);
  const [delivery, setDelivery] = useState("Yes");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<{ key: number; value: string }[]>([]);
  const [query, setQuery] = useState(businessState.location.address);
  const [isOpen, setisOpen] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [deliveryPromo, setDeliveryPromo] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<{
    Latitude?: number;
    Longitude?: number;
  }>({});
  const [d, setD] = useState<{ key: string; value: number }[]>([]);
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
  let dataService = [
    { key: "Product", value: "Product" },
    { key: "Service", value: "Service" },
    { key: "Product && Service", value: "Product && Service" },
  ];
  const [selectedRole, setSelectedRole] = useState("");
  const fetchPredictions = async (text: string) => {
    if (text.length > 0) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
          {
            params: {
              input: text,
              key: "AIzaSyAmjADpu_qyt0lA1t-8PeUrcR9hrggezTI",
              language: "en",
            },
          }
        );
        setPredictions(response.data.predictions);
      } catch (error) {
        console.error(error);
      }
    } else {
      setPredictions([]);
    }
  };
  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            placeid: placeId,
            key: "AIzaSyAmjADpu_qyt0lA1t-8PeUrcR9hrggezTI",
            language: "en",
          },
        }
      );
      const { lat, lng } = response.data.result.geometry.location;

      setSelectedPlace({ Latitude: lat, Longitude: lng });
      console.log("Latitude:", lat, "Longitude:", lng);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    let BusData = { ...businessState };
    const dataUpdate = {
      location: {
        address: query,
        coord: {
          latitude: selectedPlace.Latitude!!,
          longtitude: selectedPlace.Longitude!!,
        },
      },
      offering: selectedRole,
      business_hours: {
        opening: openingTime,
        closing: closingTime,
      },
      offersDelivery: delivery === "Yes" ? true : false,
      store_name: name,
      store_pic: img,
      free_delivery_promo: deliveryPromo,
    };
    BusData = { ...businessState, ...dataUpdate };
    BE_updateBusiness(BusData, dispatch);
  };

  const radioButtons = useMemo(
    () => [
      {
        id: "No",
        label: "No",
        value: "No",
      },
      {
        id: "Yes",
        label: "Yes",
        value: "Yes",
      },
    ],
    []
  );

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
  console.log(delivery === "row");
  const styles = StyleSheet.create({
    cont: {
      backgroundColor: appTheme.colors?.primary,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 9,
    },
  });
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
          Business Settings
        </Text>
      </View>
      <ScrollView>
        <View style={styles2.sections} className="mt-2">
          <View>
            <Text
              style={styles2.text}
              className="text-[18px] font-semibold w-[220px]"
            >
              Business Name
            </Text>
          </View>

          <View className="mt-[5%] flex-row items-center gap-5 ">
            <TextInput
              editable={editName}
              placeholder="Video url"
              placeholderTextColor={appTheme.colors?.textColor}
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
              style={[
                styles2.inputs,
                {
                  ...(editName && {
                    borderBottomColor: appTheme.colors?.textColor,
                  }),
                },
              ]}
              className=" rounded-sm py-3 w-[60%] "
            ></TextInput>
            <MaterialIcons
              onPress={() => {
                setEditName(!editName);
              }}
              name="edit"
              className="left-8 top-2"
              color={appTheme.colors?.textColor}
              size={18}
            />
          </View>
        </View>
        <View style={styles2.sections} className="mt-2">
          <View>
            <Text style={styles2.text} className="text-[18px] font-semibold">
              Business Logo
            </Text>
          </View>

          <TouchableNativeFeedback onPress={handleImageUpload}>
            <View className="mt-[5%] w-[35px] rounded-full">
              {img ? (
                <>
                  <Image
                    width={50}
                    height={50}
                    borderRadius={5}
                    source={{
                      uri: img,
                    }}
                  />
                </>
              ) : (
                <>
                  <View
                    style={{
                      backgroundColor: appTheme.colors?.background,
                    }}
                    className=" rounded-sm py-14  w-[100%] "
                  ></View>
                </>
              )}
            </View>
          </TouchableNativeFeedback>
        </View>
        <View className="mt-2" style={styles2.sections}>
          <View>
            <Text style={styles2.text} className="text-[18px]">
              Location
            </Text>
          </View>
          <View className=" flex-row ">
            <TextInput
              editable={editLocation}
              placeholder="Search"
              multiline
              onPressOut={() => {
                setisOpen(false);
              }}
              onChangeText={(text) => {
                setQuery(text);
                fetchPredictions(text);
                setisOpen(true);
              }}
              onKeyPress={() => {
                if (query.length < 2) {
                  setisOpen(false);
                }
              }}
              value={query}
              style={[
                styles2.inputs,
                {
                  ...(editLocation && {
                    borderBottomColor: appTheme.colors?.textColor,
                  }),
                },
              ]}
              className=" rounded-sm py-3 w-[90%] "
            />
            <MaterialIcons
              onPress={() => {
                setEditLocation(!editLocation);
              }}
              name="edit"
              className="left-0 top-3"
              color={appTheme.colors?.textColor}
              size={18}
            />
          </View>
        </View>
        {isOpen ? (
          <>
            <View
              style={{
                height: "auto",
                width: "auto",
                backgroundColor: appTheme.colors?.primary,
              }}
            >
              <FlatList
                style={{ height: 180 }}
                data={predictions}
                nestedScrollEnabled
                //@ts-ignore
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderBottomColor: appTheme.colors?.textColor,
                      borderBottomWidth: 1,
                    }}
                    onPress={() => {
                      setisOpen(false);
                      //@ts-ignore
                      setQuery(item.description);
                      setPredictions([]);
                      //@ts-ignore
                      fetchPlaceDetails(item.place_id);
                    }}
                  >
                    <Text style={styles2.text}>
                      {
                        //@ts-ignore
                        item.description
                      }
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        ) : (
          <View className="mt-2" style={styles2.sections}>
            <View className="mb-5">
              <Text style={styles2.text} className="text-[18px] font-semibold">
                Business Offering
              </Text>
            </View>
            <SelectList
              setSelected={(val: string) => setSelectedRole(val)}
              data={dataService}
              save="value"
              inputStyles={styles2.text}
              dropdownTextStyles={styles2.text}
              placeholder="Offering"
              search={false}
            />
          </View>
        )}
        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%] mt-2 "
        >
          <View>
            <Text style={styles2.text} className="text-[18px] font-semibold">
              Delivery
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
                setDelivery(s);
              }}
              selectedId={delivery}
            />
          </View>
        </View>

        <View
          style={{ backgroundColor: appTheme.colors?.primary }}
          className="p-[5%] mt-2 "
        >
          <View className="flex-row items-center gap-2">
            <Text
              style={[
                styles2.text,
                { borderColor: "transparent", borderWidth: 1 },
              ]}
              className="text-[18px] font-semibold"
            >
              Free Delivery Promo
            </Text>
            <Tooltip
              topAdjustment={-20}
              isVisible={contentVisible}
              contentStyle={{ backgroundColor: appTheme.colors?.primary }}
              content={
                <Text style={styles2.text}>
                  Minimum spend required for free delivery
                </Text>
              }
              placement="top"
              onClose={() => setContentVisible(!contentVisible)}
            >
              <Feather
                className="-top-[2px]"
                name="info"
                onPress={() => {
                  setContentVisible(!contentVisible);
                }}
                color={appTheme.colors?.textColor}
                size={19}
              />
            </Tooltip>
          </View>
          <View className="mt-[5%]">
            <TextInput
              placeholder="Search"
              onChangeText={(text) => {
                setDeliveryPromo(Number(text));
              }}
              keyboardType="numeric"
              value={String(deliveryPromo)}
              style={styles2.inputs}
              className=" rounded-sm py-3 w-[20%] "
            />
          </View>
        </View>

        <View style={styles2.sections} className="mt-2">
          <View>
            <Text
              style={styles2.text}
              className="text-[18px] font-semibold w-[220px]"
            >
              Trading Hours
            </Text>
          </View>
          <View>
            <Text
              style={styles2.text}
              className="text-[15px] font-semibold mt-[2%]"
            >
              Opening Time
            </Text>

            <View className="flex-row items-center gap-5 ">
              <TouchableOpacity
                onPress={() => {
                  setVisible({ ...visible, opening: true });
                }}
              >
                <TextInput
                  editable={false}
                  value={openingTime}
                  style={styles2.inputs}
                  className=" rounded-sm py-3 "
                ></TextInput>
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-5">
            <Text
              style={styles2.text}
              className="text-[15px] font-semibold mt-[2%]"
            >
              Closing Time
            </Text>

            <View className="flex-row items-center gap-5 ">
              <TouchableOpacity
                onPress={() => {
                  setVisible({ ...visible, closing: true });
                }}
              >
                <TextInput
                  editable={false}
                  value={closingTime}
                  style={styles2.inputs}
                  className=" rounded-sm py-3  "
                ></TextInput>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="p-[5%]  justify-between  flex-row">
          <ClickableBtn title="Save" onPress={handleSubmit} width={120} />
          <ClickableBtn
            width={125}
            onPress={() => {
              navigation.goBack();
            }}
            title="Cancel"
          />
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={visible.opening}
        mode="time"
        onConfirm={(time) => {
          setOpeningTime(time.toTimeString().split(" ")[0]);
          setVisible({ ...visible, opening: false });
        }}
        onCancel={() => setVisible({ ...visible, opening: false })}
      />
      <DateTimePickerModal
        isVisible={visible.closing}
        mode="time"
        onConfirm={(time) => {
          setClosingTime(time.toTimeString().split(" ")[0]);
          setVisible({ ...visible, closing: false });
        }}
        onCancel={() => setVisible({ ...visible, closing: false })}
      />
    </View>
  );
};
export default memo(BusinessSetting);
