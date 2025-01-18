import { createSlice } from "@reduxjs/toolkit";
import {
  BusinessAccount,
  BusRegData,
  Cart,
  CartItem,
  personalAccount,
  product,
} from "../utilities/Types";
import { act } from "react";
import { getBusinessById, getDiscountProducts } from "./store";

export const defaultUser: personalAccount = {
  businessid: "",
  buyer_rating: 0,
  followers: [],
  following: [],
  has_business: true,
  has_wallet: false,
  id: "",
  isOnline: true,
  last_seen: new Date(),
  password: "Wanewa@12",
  phonenumber: "0839795056",
  profile_pic:
    "https://1000logos.net/wp-content/uploads/2017/05/Color-PUMA-Logo.jpg",
  email: "Waneex@gamil.com",
  username: "Carl Johnson",
};
const defaultGuestId = "";

const defaultBusRegData: BusRegData = {};
const initialState = {
  currentUser: defaultUser,
  busRegData: defaultBusRegData,
  guestId: defaultGuestId,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      state.currentUser = user;
    },
    setRegData: (state, action) => {
      const data: BusRegData = action.payload;
      state.busRegData = { ...data };
    },
    setGuestId:(state, action) => {
      const id = action.payload;
      state.guestId = id
    },
  },
});

export const { setRegData, setUser ,setGuestId} = userSlice.actions;
export default userSlice.reducer;
