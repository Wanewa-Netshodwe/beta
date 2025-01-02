import { View, Text, Image } from "react-native";
import React from "react";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";

type Props = {};

const BankHolderPic = (props: Props) => {
  const { appTheme, userState } = useStates();
  const styles = useDynamicStyles();
  return (
    <View style={{width:86}} className=" gap-2 items-center">
      <Image
        width={50}
        height={50}
        borderRadius={60}
        source={{ uri: userState.currentUser.profile_pic }}
      />
      <Text className="text-[12px] text-center" style={styles.text}>
        {userState.currentUser.username}
      </Text>
    </View>
  );
};

export default BankHolderPic;
