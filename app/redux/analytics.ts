import { createSlice } from "@reduxjs/toolkit";
import { analytics } from "../utilities/Types";
import Analytics from "../Screens/Business/Analytics";
const defaultAnalytics: analytics[] = [];
const lastVistedBusinessId: string = "";
const initialState = {
  Analytics: defaultAnalytics,
  lastVistedBusiness: lastVistedBusinessId,
};
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setLastVisted: (state, action) => {
      const id = action.payload;
      state.lastVistedBusiness = id;
    },
    addAnalytic: (state, action: { payload: analytics }) => {
      const info = action.payload;
      const findIndex = state.Analytics.findIndex(
        (analy) => analy.id === info.id
      );
      findIndex === -1 && state.Analytics.push(info);
    },
  },
});
export const { setLastVisted } = analyticsSlice.actions;
export default analyticsSlice.reducer;
