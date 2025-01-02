import { View, Text, Image } from "react-native";
import React from "react";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";

type Props = {};

const TransactionHolder = (props: Props) => {
  const { userState ,appTheme} = useStates();
  const styles = useDynamicStyles();
  return (
    <View style={{borderColor:appTheme.colors?.quaternary,borderWidth:2}} className=" rounded-md  p-2 items-center justify-between flex-row">
      <View className="flex-row gap-2 items-center">
        <Image
          source={{ uri: userState.currentUser.profile_pic }}
          width={30}
          height={30}
          borderRadius={5}
        />
        <View>
          <Text className="text-[10px] top-1" style={styles.text}>
            {userState.currentUser.username}
          </Text>
          <Text className="text-[10px]" style={styles.text}>
            01-Jan-2025 16:76
          </Text>
        </View>
      </View>

      <View>
        <Text className="text-[10px]" style={[styles.text, { color: "red" }]}>
          -R340
        </Text>
      </View>
    </View>
  );
};

export default TransactionHolder;
