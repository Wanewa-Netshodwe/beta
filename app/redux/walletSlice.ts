import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wallets: [],
};

const walletSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setWallets: (state, action) => {
      const wallets = action.payload;
      state.wallets = wallets;
    },
  },
});

export const { setWallets } = walletSlice.actions;
export default walletSlice.reducer;
