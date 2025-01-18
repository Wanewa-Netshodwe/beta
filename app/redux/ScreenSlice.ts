import { createSlice } from "@reduxjs/toolkit";
import { analytics } from "../utilities/Types";
import Analytics from "../Screens/Business/Analytics";
const initialState = {
  current_screen: "layout",
};
const ScreenSlice = createSlice({
  name: "screens",
  initialState,
  reducers: {
    setCurrentScreen: (state, action) => {
      const screen = action.payload;
      state.current_screen = screen;
    },
  },
});
export const { setCurrentScreen } = ScreenSlice.actions;
export default ScreenSlice.reducer;
