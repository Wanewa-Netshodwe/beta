import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { getColors } from "react-native-image-colors";
export default function ImageHolder() {
  const [img, setImg] = useState("");
  const [bg, setBg] = useState("white");
  const [colors, setColors] = useState<any>(null);
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
  useEffect(() => {
    getColors(img, {
      fallback: "#228B22",
      cache: true,
      key: img,
    }).then((v) => {
      //@ts-ignore
      setBg(v.dominant);
      setColors(v.platform);
    });
  }, [img]);
  console.log("colors gotteng :", colors);
  return (
    <View style={{ backgroundColor: bg }}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 150,
          height: 150,
          backgroundColor: "gray",
          borderRadius: "100%",
        }}
      >
        {img ? (
          <Pressable onPress={handleImageUpload}>
            <Image
              width={150}
              height={150}
              borderRadius={1000}
              source={{
                uri: img,
              }}
            />
          </Pressable>
        ) : (
          <Feather
            onPress={handleImageUpload}
            style={{ fontSize: 60, color: "white" }}
            name="camera"
          />
        )}
      </View>
    </View>
  );
}
