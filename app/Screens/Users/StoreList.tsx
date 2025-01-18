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
import { setCurrentScreen } from "../../redux/ScreenSlice";
import { updateAnayltic } from "../../utilities/UserAnayltics";
import { useFocusEffect } from "@react-navigation/native";

type Props = StackScreenProps<StackStoreListParamList, "stores">;

const StoreList: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { AllBusiness, lastvisitedBusiness } = useStates();
  useFocusEffect(() => {
    dispatch(setCurrentScreen("StoreList"));
    updateAnayltic(lastvisitedBusiness, "StoreList");
  });
  console.log("store list called ");
  console.log("last busines visted", lastvisitedBusiness);

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
    </View>
  );
};

export default StoreList;
