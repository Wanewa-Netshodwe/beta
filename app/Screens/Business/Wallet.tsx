import { View, Text } from "react-native";
import React from "react";
import { useStates } from "../../utilities/States";

type Props = {};

const Wallet = (props: Props) => {
  const { businessState } = useStates();
  const businessData = businessState.userBusiness;
  console.log("Waletttt called ");
  return (
    <View>
      <Text>Wallet</Text>
    </View>
  );
};

export default Wallet;
