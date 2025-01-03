import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootTabParamList } from "../../utilities/Types";
import { useStates } from "../../utilities/States";
import { Entypo } from "@expo/vector-icons";
import { useDynamicStyles } from "../../utilities/Styles";
type Props = StackScreenProps<RootTabParamList, "UserPage">;

const GoToBusiness = ({ navigation }: Props) => {
  const { appTheme } = useStates();
  const styles = useDynamicStyles();
  return (
    <View className="p-[5%]">
      <TouchableNativeFeedback
        onPress={() => {
          navigation.popTo("Business");
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
          <Entypo name="colours" size={30} color={appTheme.colors?.secondary} />
          <Text style={styles.text} className="text-[18px] font-semibold">
            Change App Theme
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default GoToBusiness;
