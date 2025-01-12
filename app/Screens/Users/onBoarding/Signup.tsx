import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import {
  BE_getAllBusinesses,
  BE_login,
  BE_signup,
} from "../../../backend/Queries";
import { Rating} from "react-native-ratings";
import { BusRegData } from "../../../utilities/Types";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [ratingCompleted, setRatingCompleted] = useState();
  const [img, setImg] = useState("");
  console.log(ratingCompleted);
  const handleSignup = () => {
    const data = {
      image: img,
      fileName: "ProfilePic",
      username: name,
      email: email,
      password: password,
      phonenumber: phonenumber,
      navigation: navigation,
      dispatch: dispatch,
    };
    BE_signup(data);
  };
  const handleSignin = () => {
    const data = {
      email: email,
      password: password,

      dispatch: dispatch,
    };
    BE_login(data);
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
    <View className="bg-white">
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
          <Image
            width={150}
            height={150}
            borderRadius={1000}
            source={{
              uri: img,
            }}
          />
        ) : (
          <Feather
            onPress={handleImageUpload}
            style={{ fontSize: 60, color: "white" }}
            name="camera"
          />
        )}
      </View>
      <TextInput
        onChangeText={(text) => {
          setName(text);
        }}
        value={name}
        placeholder="username"
      />
      <TextInput
        keyboardType="phone-pad"
        onChangeText={(text) => {
          setPhonenumber(text);
        }}
        value={phonenumber}
        placeholder="Phone Number"
      />
      <TextInput
        keyboardType="email-address"
        onChangeText={(text) => {
          setEmail(text);
        }}
        value={email}
        placeholder="email"
      />
      <TextInput
        secureTextEntry={true}
        passwordRules={
          "required: upper; required: lower; required: digit;minlength: 8"
        }
        onChangeText={(text) => {
          setPassword(text);
        }}
        value={password}
        placeholder="password"
      />
      <Button onPress={handleSignup} title="signup"></Button>
      <Button onPress={handleSignin} title="signin"></Button>
      <View className="mt-2 p-5">
        <Rating
        style={{borderColor:'black',borderWidth:1 ,width:'50%'}}
          type="custom"
          ratingColor="red"
          ratingBackgroundColor="blue"
          tintColor="white"
          readonly
          fractions={0}
          imageSize={15}
         
        />
       
        
      </View>
    </View>
  );
}
