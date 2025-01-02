import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";
import { Entypo, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
type Props = {};

const WalletBalance = (props: Props) => {
  const { appTheme } = useStates();
  const [visible, SetVisible] = useState(false);
  const styles = useDynamicStyles();
  return (
    <LinearGradient 
    colors={[appTheme.colors?.primary!!,appTheme.colors?.background!!]}
    start={{x:0,y:0}}
    end={{x:1.5,y:1}}
   
    >
      <View className="p-2   items-center justify-center ">
        <View className=" items-center justify-center">
          <Text style={styles.text} className="text-[13px] text-center top-4">
            Balance
          </Text>
          <View className="flex-row   justify-center items-center">
            <TextInput
              editable={false}
              value="R250.76"
              secureTextEntry={visible}
              style={[{ backgroundColor: "transparent" }, styles.text]}
              className="text-[25px] text-center "
            />
            <Entypo
              style={{}}
              className=" left-4 "
              name={visible ? "eye" : "eye-with-line"}
              color={appTheme.colors?.secondary}
              size={20}
              onPress={() => {
                SetVisible(!visible);
              }}
            />
          </View>
        </View>
        <View className="flex-row   items-center justify-center gap-2">
          <View
            style={{
              borderRightWidth: 1.5,
              borderColor: appTheme.colors?.secondary,
            }}
            className="items-center p-2  gap-1 "
          >
            <AntDesign
              name="arrowup"
              color={appTheme.colors?.textColor}
              size={20}
            />
            <Text className="text-center text-[14px]" style={styles.text}>
              Deposit
            </Text>
          </View>
          <View
            style={{
              borderRightWidth: 1.5,
              borderColor: appTheme.colors?.secondary,
            }}
            className="items-center p-2  gap-1 "
          >
            <AntDesign
              name="arrowdown"
              color={appTheme.colors?.textColor}
              size={20}
            />
            <Text className="text-center text-[14px]" style={styles.text}>
              Withdraw
            </Text>
          </View>
          <View className="items-center p-2  gap-1">
            <MaterialCommunityIcons
              name="bank-transfer"
              color={appTheme.colors?.textColor}
              size={20}
            />
            <Text className="text-center text-[14px]" style={styles.text}>
              Transfer
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default WalletBalance;
