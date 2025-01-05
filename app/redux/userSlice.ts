import { createSlice } from "@reduxjs/toolkit";
import {
  BusRegData,
  Cart,
  CartItem,
  personalAccount,
} from "../utilities/Types";

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
const defaultCart: Cart = { items: [] };
const defaultBusRegData: BusRegData = {};
const initialState = {
  currentUser: defaultUser,
  busRegData: defaultBusRegData,
  cart: defaultCart,
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
    addCart: (state, action) => {
      const item: CartItem = action.payload;
      let found = false;
      let cartItems = state.cart.items;
      cartItems = cartItems.map((items) => {
        if (items.business?.id === item.business?.id) {
          found = true;
          items.products.push(item.products[0]);
          return items;
        }
        return items;
      });
      found ? (state.cart.items = cartItems) : state.cart.items.push(item);
    },
  },
});

export const { setRegData, setUser, addCart } = userSlice.actions;
export default userSlice.reducer;
