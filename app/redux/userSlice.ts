import { createSlice } from "@reduxjs/toolkit";
import { BusRegData, personalAccount } from "../utilities/Types";

export const defaultUser: personalAccount = {
  businessid: "hjoZMJGDpAe802w4SDEw",
  buyer_rating: 0,
  followers: [],
  following: [],
  has_business: true,
  has_wallet: false,
  id: "Hd81oqoxT0NDLs80xJY33Vlwbs23",
  isOnline: true,
  last_seen: new Date(),
  password: "Wanewa@12",
  phonenumber: "0839795056",
  profile_pic:
    "https://1000logos.net/wp-content/uploads/2017/05/Color-PUMA-Logo.jpg",
  email: "Waneex@gamil.com",
  username: "Carl Johnson",
};
const defaultBusRegData: BusRegData = {};
const initialState = {
  currentUser: defaultUser,
  busRegData: defaultBusRegData,
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
  },
});

export const {setRegData, setUser } = userSlice.actions;
export default userSlice.reducer;
