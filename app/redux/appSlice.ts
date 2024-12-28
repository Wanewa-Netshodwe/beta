import { createSlice } from "@reduxjs/toolkit";
import { AppTheme } from "../utilities/Types";

const defaultTheme: AppTheme = {
  current_screen: "layout",
  colors: {
    background: "#e6e6e6",
    primary: "#ffffff",
    secondary: "#26274a",
    tertiary: "#292929",
    quaternary: "#9d9d9e",
    quaternarySup: "#ffffff",
    textColor: "#292929",
  },
  fonts: {
    primary: "Poppins",
  },
};

const initialState = {
  appTheme: defaultTheme,
};

const appSlice = createSlice({
  name: "Theme",
  initialState,
  reducers: {
    setFont: (state, action) => {
      if (state.appTheme.fonts) {
        state.appTheme.fonts.primary = action.payload;
      } else {
        state.appTheme.fonts = { primary: action.payload };
      }
    },
    setColor: (state, action) => {
      state.appTheme = action.payload;
    },
  },
});

export const { setFont, setColor } = appSlice.actions;

export default appSlice.reducer;
