import { View, Text, TouchableHighlight } from "react-native";
import React, { useEffect, useMemo } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import {
  BusinessAccount,
  StackStoreListParamList,
} from "../../utilities/Types";
import { useStates } from "../../utilities/States";
import StoreDisplay from "../../components/StoreDisplay";
import { FlatList } from "react-native-gesture-handler";
import CartItem from "../../components/CartItemHolder";
import { useDispatch } from "react-redux";
import { BE_getAllBusinesses } from "../../backend/Queries";

type Props = StackScreenProps<StackStoreListParamList, "stores">;

const StoreList: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { AllBusiness } = useStates();

  return (
    <View className="p-[5%]">
      <FlatList
        data={AllBusiness}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress={() => {
              navigation.navigate("viewStore", { business: item });
            }}
          >
            <View className="mb-2 border">
              <StoreDisplay BusinessData={item} />
            </View>
          </TouchableHighlight>
        )}
      />
      =
    </View>
  );
};

export default StoreList;
