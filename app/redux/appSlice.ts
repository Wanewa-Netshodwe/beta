import { createSlice } from "@reduxjs/toolkit";
import { AppTheme } from "../utilities/Types";

const defaultTheme: AppTheme = {
  colors: {
    background: "#000000",
    primary: "#7d0405",
    secondary: "#d33f0f",
    tertiary: "#fa8840",
    quaternary: "#f7b16c",
    quaternarySup: "#fedfcd",
    textColor: "#ededed",
  },
  fonts: {
    primary: "roman_font_7",
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
