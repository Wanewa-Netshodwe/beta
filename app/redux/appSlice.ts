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
      const { type, color }: { type: string; color: string } = action.payload;
      switch (type) {
        case "primary":
          state.appTheme.colors!!.primary = color;
          break;
        case "secondary":
          state.appTheme.colors!!.secondary = color;
          break;
        case "quaternary":
          state.appTheme.colors!!.quaternary = color;
          break;
        case "tertiary":
          state.appTheme.colors!!.tertiary = color;
          break;
        case "textColor":
          state.appTheme.colors!!.textColor = color;
          break;
      }
    },
  },
});

export const { setFont, setColor } = appSlice.actions;

export default appSlice.reducer;
