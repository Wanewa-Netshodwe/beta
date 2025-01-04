import { View, Text, Image } from "react-native";
import React from "react";
import WalletHeader from "../../components/WalletHeader";
import WalletBalance from "../../components/WalletBalance";
import { useStates } from "../../utilities/States";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { useDynamicStyles } from "../../utilities/Styles";
import BankHolderPic from "../../components/BankHolderPic";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import OutlineBtn from "../../components/OutlineBtn";
import TransactionHolder from "../../components/TransactionHolder";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../../utilities/Types";

type Props = BottomTabScreenProps<TabParamList, "wallet">;

const Wallet: React.FC<Props> = (props: Props) => {
  console.log('wallet coalled')
  const { appTheme, userState } = useStates();
  const styles = useDynamicStyles();
  return (
    <View
      style={{ backgroundColor: appTheme.colors?.background }}
      className="w-full h-full"
    >
      <View
        style={{
          backgroundColor: appTheme.colors?.primary,
          borderBottomStartRadius: 0,
          borderBottomEndRadius: 0,
        }}
        className="p-[5%]"
      >
        <WalletHeader />
        <WalletBalance />
      </View>
      <View className="p-[5%] ">
        <Text style={styles.text}>Account Holders</Text>

        <ScrollView horizontal>
          <View className="mt-2 flex-row gap-3">
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: appTheme.colors?.primary,
              }}
              className=" p-5 gap-2 items-center justify-center rounded-full"
            >
              <AntDesign
                size={25}
                name="plus"
                color={appTheme.colors?.textColor}
              />
            </View>
            <BankHolderPic />
          </View>
        </ScrollView>
      </View>
      <View className="p-[5%] -top-2  ">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-[15px] "
            style={[
              styles.text,
              { borderColor: "transparent", borderWidth: 1 },
            ]}
          >
            Latest Transaction
          </Text>
          <Text
            className="text-[10px]"
            style={[
              styles.text,
              { borderColor: "transparent", borderWidth: 1 },
            ]}
          >
            View all
          </Text>
        </View>
        <ScrollView>
          <View className="mt-2 gap-3">
            <TransactionHolder />
            <TransactionHolder />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Wallet;
