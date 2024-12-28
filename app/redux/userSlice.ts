import { createSlice } from "@reduxjs/toolkit";
import { personalAccount } from "../utilities/Types";

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
    "https://firebasestorage.googleapis.com/v0/b/pocketpal-509a5.firebasestorage.app/o/images%2FHd81oqoxT0NDLs80xJY33Vlwbs23%2FProfilePic.png?alt=media&token=fe2c1158-f757-4691-aa41-73a768b61bc6",
  email: "Waneex@gamil.com",
  username: "Carl Johnson",
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
