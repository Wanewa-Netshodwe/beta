import { View, Text, ScrollView, TouchableNativeFeedback } from "react-native";
import React, { useState } from "react";
import Screen from "../../utilities/Screen";
import { useDynamicStyles } from "../../utilities/Styles";
import * as Font from "expo-font";
import fontMap from "../../utilities/fontMap";
import { useStates } from "../../utilities/States";
import LoadingComp from "../../utilities/LoadingComp";
import { Entypo } from "@expo/vector-icons";
import { StackSettingsParamList, TabParamList } from "../../utilities/Types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<StackSettingsParamList, "home">;

const Settings: React.FC<Props> = ({ navigation }: Props) => {
  const { appTheme } = useStates();
  const font = appTheme.fonts?.primary!!;
  const [loaded] = Font.useFonts({
    font: fontMap[font], // Map Redux font name to the correct font file
  });
  const styles = useDynamicStyles();
  return (
    <View
      style={{ backgroundColor: appTheme.colors?.background }}
      className="w-full h-full"
    >
      <View className="p-5">
        <LoadingComp
          loaded={loaded}
          item={
            <Text style={styles.text} className={`text-[24px]  `}>
              Settings
            </Text>
          }
        />

        <ScrollView>
          <TouchableNativeFeedback
            onPress={() => {
              navigation.navigate("AppTheme");
            }}
          >
            <View
              className=" mt-5 flex-row p-4 items-center gap-3"
              style={{
                borderBottomColor: appTheme.colors?.quaternarySup,
                borderTopColor: appTheme.colors?.quaternarySup,
                borderLeftWidth: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderWidth: 1,
              }}
            >
              <Entypo
                name="colours"
                size={30}
                color={appTheme.colors?.secondary}
              />
              <Text style={styles.text} className="text-[18px] font-semibold">
                Change App Theme
              </Text>
            </View>
          </TouchableNativeFeedback>
        </ScrollView>
      </View>
    </View>
  );
};

export default Settings;
