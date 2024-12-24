import { createSlice } from "@reduxjs/toolkit";
import { personalAccount } from "../utilities/Types";

export const defaultUser: personalAccount = {
  businessid: "",
  buyer_rating: 0,
  followers: [],
  following: [],
  has_business: false,
  has_wallet: false,
  id: "",
  isOnline: false,
  last_seen: new Date(),
  password: "",
  phonenumber: "",
  profile_pic: "",
  store_id: "",
  email: "",
  username: "",
};
const initialState = {
  currentUser: defaultUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      state.currentUser = user;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
