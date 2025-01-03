import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";

type Props = {};

const WalletHeader = (props: Props) => {
  const { userState } = useStates();
  const styles = useDynamicStyles();
  return (
    <View className="p-2  items-center  flex-row gap-1">
      <Image
        source={{ uri: userState.currentUser.profile_pic }}
        width={40}
        height={40}
        borderRadius={75}
      />
      <View className="p-1">
        <Text className="text-[13px] top-1 " style={styles.text}>
          Hello
        </Text>
        <Text className="text-[14px] " style={styles.text}>
          {userState.currentUser.username}
        </Text>
      </View>
    </View>
  );
};

export default WalletHeader;
