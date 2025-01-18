import AsyncStorage from "@react-native-async-storage/async-storage";
import { analytics, customerAnalytics } from "./Types";
import { getGuestId, getUserId } from "../redux/store";
import { createRandomId } from "../backend/Queries";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { setGuestId } from "../redux/userSlice";

const has24HoursPassed = (startDate: Date): boolean => {
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate.getTime() - startDate.getTime();
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
  return differenceInHours >= 24;
};

const findAnalytic = (businessId: string, result: string) => {
  const data: analytics[] = JSON.parse(result);
  const index = data.findIndex(
    (analytic) => analytic.business_id === businessId
  );
  if (index !== -1) {
    return [data[index], index] as [analytics, number];
  }
  return null;
};
const findIndex = (businessId: string, result: string) => {
  const data: analytics[] = JSON.parse(result);
  const index = data.findIndex(
    (analytic) => analytic.business_id === businessId
  );
  return index;
};
export const createAnayltic = async (
  businessId: string,
  dispatch: Dispatch<UnknownAction>
): Promise<void> => {
  let found_index = -1;
  let userId = getUserId();
  console.log("create anylytic callleddddddddddd");

  if (userId.length < 5) {
    const Guestid = getGuestId();
    console.log("guest id",Guestid);
    const guestId = Guestid.length > 5 ? Guestid : createRandomId();
   
    if (Guestid.length < 5) {
      console.log("guest id is null setting new one");
      dispatch(setGuestId(guestId));
      await AsyncStorage.setItem("guestId", guestId);
    }
    userId = guestId;
  }

  const result = await AsyncStorage.getItem("analytics");
  if (result) found_index = findIndex(businessId, result);
  if (result && found_index != -1) {
    console.log("using existing analytic rec");
    const resultset = findAnalytic(businessId, result);
    if (resultset) {
      const [foundAnalytic, index] = resultset;
      const updatedCustomerAnalytic = { ...foundAnalytic.customerAnalytics };
      updatedCustomerAnalytic.timeSpendInStore =
        (updatedCustomerAnalytic.timeSpendInStore || 0) + performance.now();
      updatedCustomerAnalytic.date = new Date();
      updatedCustomerAnalytic.userId = userId;

      const updatedAnalytic = { ...foundAnalytic };
      updatedAnalytic.customerAnalytics = updatedCustomerAnalytic;
      updatedAnalytic.last_modified = new Date();
      updatedAnalytic.visits = has24HoursPassed(updatedCustomerAnalytic.date)
        ? (updatedAnalytic.visits || 0) + 1
        : updatedAnalytic.visits;

      const data: analytics[] = JSON.parse(result);
      data[index] = updatedAnalytic;

      await AsyncStorage.setItem("analytics", JSON.stringify(data));
    }
  } else {
    console.log("creating new  analytic rec");
    const customerAnalytic: customerAnalytics = {
      userId,
      date: new Date(),
      timeSpendInStore: performance.now(),
    };

    const newAnalytic: analytics = {
      customerAnalytics: customerAnalytic,
      id: createRandomId(),
      business_id: businessId,
      last_modified: new Date(),
      visits: 1,
    };

    const analyticsArray: analytics[] = result ? JSON.parse(result) : [];
    analyticsArray.push(newAnalytic);
    await AsyncStorage.setItem("analytics", JSON.stringify(analyticsArray));
  }
};

export const updateAnayltic = async (
  businessId: string,
  currentScreen: string
): Promise<void> => {
  const result = await AsyncStorage.getItem("analytics");

  if (result && currentScreen === "StoreList") {
    const data: analytics[] = JSON.parse(result);
    const resultset = findAnalytic(businessId, result);
    if (resultset) {
      const [foundAnalytic, index] = resultset;
      foundAnalytic.last_modified = new Date();
      const diff =
        performance.now() - foundAnalytic.customerAnalytics.timeSpendInStore!;
      foundAnalytic.customerAnalytics.timeSpendInStore = diff;
      data[index] = foundAnalytic;
      await AsyncStorage.setItem("analytics", JSON.stringify(data));
    }
  }
};
