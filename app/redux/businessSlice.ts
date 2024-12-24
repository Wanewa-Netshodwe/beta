import { createSlice } from "@reduxjs/toolkit";
import {
  BusinessAccount,
  BusRegData,
  category,
  product,
  sectionData,
} from "../utilities/Types";
const defaultBusRegData: BusRegData = {};

export const defaultBusiness: BusinessAccount = {
  dis_auth: false,
  font: "",
  has_subscription: false,
  business_hours: {
    closing: "",
    opening: "",
  },
  id: "",
  location: {
    address: "",
    coord: {
      latitude: 889,
      longtitude: 99,
    },
  },
  offering: "",
  password: "",
  sections: [],
  seller_rating: 0,
  social_media_links: "",
  store_name: "",
  store_pic: "",
  userId: "",
  verified: false,
  edit: true,
};
const products: product[] = [];
const initialState = {
  userBusiness: defaultBusiness,
  products: products,
  wallets: [],
  busRegData: defaultBusRegData,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setRegData: (state, action) => {
      const data: BusRegData = action.payload;
      state.busRegData = { ...data };
    },
    setBusiness: (state, action) => {
      const business = action.payload;
      state.userBusiness = business;
    },
    addSection: (state, action) => {
      const section: sectionData = action.payload;
      console.log("section to be added :", section);

      let sec = state.userBusiness.sections;
      let sections = [...sec];
      sections.splice(section.postion, 0, section);
      state.userBusiness.sections = sections;
    },
    delSection: (state, action) => {
      const section: sectionData = action.payload;
      let sec = state.userBusiness.sections;
      let sections = [...sec];
      const idx = sections.findIndex((item) => item.name === section.name);

      if (idx !== -1) {
        sections.splice(idx, 1);
      }
      state.userBusiness.sections = sections;
    },
    addCategoryList: (state, action) => {
      const section: sectionData = action.payload;
      state.userBusiness.sections.push(section);
    },
    addProduct: (state, action) => {
      const product: product = action.payload;
      const sectionIndex = state.userBusiness.sections.findIndex(
        (sec) => sec.name === product.section
      );

      if (sectionIndex !== -1) {
        state.userBusiness.sections[sectionIndex].products = [
          ...(state.userBusiness.sections[sectionIndex].products || []),
          product,
        ];
      }
    },
    addCat: (state, action) => {
      const cat: category = action.payload;
      const sections = state.userBusiness.sections;

      sections.forEach((section) => {
        if (section.type === "categories" && !section.valid) {
          if (section.categoryList?.categories) {
            section.categoryList.categories.push(cat);
          } else {
            section.categoryList?.categories?.push(cat);
          }
        }
      });

      state.userBusiness.sections = sections;
    },
    saveCategoryList: (state, action) => {
      const cat: { id: string; name: string; postion: number } = action.payload;

      state.userBusiness.sections = state.userBusiness.sections.map(
        (section) => {
          if (section.type === "categories" && !section.valid) {
            if (section.categoryList?.id === cat.id) {
              return {
                ...section,
                name: cat.name,
                postion: cat.postion,
                valid: true,
              };
            }
          }

          return section;
        }
      );
    },

    setProducts: (state, action) => {
      const products = action.payload;
      state.products = products;
    },
    delCat: (state, action) => {
      const cat: { id: string; name: string; position: number } =
        action.payload;

      state.userBusiness.sections = state.userBusiness.sections.map(
        (section) => {
          if (section.type === "categories" && !section.valid) {
            if (section.categoryList?.id === cat.id) {
              const updatedCategories = section.categoryList.categories?.filter(
                (c) => c.name !== cat.name
              );
              return {
                ...section,
                categoryList: {
                  ...section.categoryList,
                  categories: updatedCategories,
                },
              };
            }
          }
          return section;
        }
      );
    },

    setWallets: (state, action) => {
      const wallets = action.payload;
      state.wallets = wallets;
    },
  },
});

export const {
  setBusiness,
  setProducts,
  setWallets,
  setRegData,
  addSection,
  delSection,
  addProduct,
  addCategoryList,
  addCat,
  saveCategoryList,
  delCat,
} = businessSlice.actions;
export default businessSlice.reducer;
