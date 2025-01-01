import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Screen from "../../../utilities/Screen";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { SelectList } from "react-native-dropdown-select-list";
import { BusRegData } from "../../../utilities/Types";
import { setRegData } from "../../../redux/userSlice";

export default function BusinessInfo() {
  let data = [
    { key: "Product", value: "Product" },
    { key: "Service", value: "Service" },
    { key: "Product && Service", value: "Product && Service" },
  ];
  const [selectedRole, setSelectedRole] = useState("");

  const [query, setQuery] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({});
  const [openingTime, setOpeningTime] = useState("Opening Time");
  const [closingTime, setClosingTime] = useState("Closing Time");
  const appTheme = useSelector((state: RootState) => state.appTheme.appTheme);
  const [img, setImg] = useState("");
  const [visible, setVisible] = useState({ opening: false, closing: false });
  const disatch = useDispatch();
  const regData = useSelector((state: RootState) => state.user.busRegData);

  const next = () => {
    const reg: BusRegData = {
      name: regData.name,
      password: regData.password,
      pic: regData.pic,
      location: {
        address: query,
        coord: {
          latitude: selectedPlace.Latitude,
          longtitude: selectedPlace.Longitude,
        },
      },
      business_hours: {
        closing: closingTime,
        opening: openingTime,
      },
      offering: selectedRole,
    };
    disatch(setRegData(reg));
    console.log(regData);
  };

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
  return (
    <Screen>
      <ScrollView>
        <View className="w-full h-full   p-[5%]">
          <View className="">
            <Text
              style={{ color: appTheme.colors?.tertiary }}
              className={`text-[24px] font-bold`}
            >
              Create Business
            </Text>
          </View>
          <View>
            <View className="mt-[10%]">
              <Text
                style={{ color: appTheme.colors?.tertiary }}
                className="text-[20px] font-bold"
              >
                Business Hours
              </Text>
              <Text
                style={{ color: appTheme.colors?.tertiary }}
                className="text-[17px] font-semibold mt-[2%]"
              >
                opening time
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
                  value={openingTime}
                  style={{
                    color: appTheme.colors?.tertiary,
                    backgroundColor: appTheme.colors?.secondary,
                  }}
                  className=" rounded-sm py-3 w-[70%] "
                ></TextInput>
              </TouchableOpacity>
            </View>
            <Text
              style={{ color: appTheme.colors?.tertiary }}
              className="text-[17px] font-semibold mt-[2%]"
            >
              closing time
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
                value={closingTime}
                style={{
                  color: appTheme.colors?.tertiary,
                  backgroundColor: appTheme.colors?.secondary,
                }}
                className=" rounded-sm py-3 w-[70%] "
              ></TextInput>
            </TouchableOpacity>
          </View>
          <View>
            <View className="mt-[10%]">
              <Text
                style={{ color: appTheme.colors?.tertiary }}
                className="text-[18px] font-semibold"
              >
                Location
              </Text>
            </View>
            <View className="mt-[5%]">
              <TextInput
                placeholder="Search"
                onPressOut={() => {
                  setisOpen(false);
                }}
                onChangeText={(text) => {
                  setQuery(text);
                  fetchPredictions(text);
                  setisOpen(true);
                }}
                value={query}
                style={{
                  color: appTheme.colors?.tertiary,
                  backgroundColor: appTheme.colors?.secondary,
                }}
                className=" placeholder:text-white rounded-sm py-3 w-[90%] "
              ></TextInput>
            </View>
          </View>
          {isOpen ? (
            <>
              <View style={{ height: "auto", width: "auto" }}>
                <FlatList
                  style={{ height: 100 }}
                  data={predictions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        borderBottomColor: "gray",

                        borderBottomWidth: 1,
                      }}
                      onPress={() => {
                        setisOpen(false);
                        setQuery(item.description);
                        setPredictions([]);
                        fetchPlaceDetails(item.place_id);
                      }}
                    >
                      <Text style={{ color: appTheme.colors?.tertiary }}>
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </>
          ) : (
            <View>
              <View className="mt-[10%]">
                <Text
                  style={{ color: appTheme.colors?.tertiary }}
                  className="text-[18px] font-semibold"
                >
                  Business Offering
                </Text>
              </View>
              <SelectList
                setSelected={(val: string) => setSelectedRole(val)}
                data={data}
                save="value"
                inputStyles={{ color: appTheme.colors?.tertiary }}
                dropdownTextStyles={{ color: appTheme.colors?.tertiary }}
                placeholder="Offering"
                search={false}
              />
            </View>
          )}

          <TouchableNativeFeedback
            onPress={() => {
              next();
            }}
          >
            <View
              style={{ backgroundColor: appTheme.colors?.tertiary }}
              className=" py-2 mt-[15%]  rounded-md  w-[40%]"
            >
              <Text className="text-[25px] w-fit font-bold text-center">
                {" "}
                Next
              </Text>
            </View>
          </TouchableNativeFeedback>
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
      </ScrollView>
    </Screen>
  );
}
