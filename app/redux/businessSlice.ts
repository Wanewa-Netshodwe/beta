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
  foregroundImg:
    "https://1000logos.net/wp-content/uploads/2017/05/Color-PUMA-Logo.jpg",
  dis_auth: false,
  font: "DESIGNER",
  has_subscription: false,
  business_hours: {
    closing: "10:00:00",
    opening: "00:30:00",
  },
  id: "hjoZMJGDpAe802w4SDEw",
  location: {
    address:
      "Rosebank Mall, Cradock Avenue, Rosebank, Johannesburg, South Africa",
    coord: {
      latitude: -26.1463218,
      longtitude: 28.0417405,
    },
  },
  offering: "Product && Service",
  password: "12345",
  sections: [],
  seller_rating: 0,
  store_name: "Carl Electronics",
  store_pic:
    "https://firebasestorage.googleapis.com/v0/b/pocketpal-509a5.firebasestorage.app/o/images%2FHd81oqoxT0NDLs80xJY33Vlwbs23%2Fbusiness%2FBusinessLogo.png?alt=media&token=9e5d65f2-6743-4a4d-8122-d405551fe39c",
  userId: "Hd81oqoxT0NDLs80xJY33Vlwbs23",
  verified: true,
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
    removeForeground: (state) => {
      state.userBusiness.foregroundImg = "";
    },
    setForegroundImg: (state, action) => {
      state.userBusiness.foregroundImg = action.payload;
    },
    addSection: (state, action) => {
      const section: sectionData = action.payload;

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
    editProduct: (state, action) => {
      const product = action.payload;
      const sectionIndex = state.userBusiness.sections.findIndex(
        (sec) => sec.name === product.section
      );

      if (sectionIndex !== -1) {
        const products = state.userBusiness.sections[sectionIndex].products;
        if (products) {
          products.forEach((pro, index) => {
            if (pro.name === product.name) {
              products[index] = product;
            }
          });
        }
      }
    },
    delProduct: (state, action) => {
      const product = action.payload;
      const sectionIndex = state.userBusiness.sections.findIndex(
        (sec) => sec.name === product.section
      );

      if (sectionIndex !== -1) {
        const products = state.userBusiness.sections[sectionIndex].products;
        if (products) {
          state.userBusiness.sections[sectionIndex].products = products.filter(
            (pro) => pro.name !== product.name
          );
        }
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
      const dummySections = state.userBusiness.sections.map((section) => {
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
      });
      const notCategories = dummySections.filter(
        (section) => section.type !== "categories"
      );
      const allCategories = dummySections.filter((section) => {
        if (section.type === "categories") {
          if (section.valid) {
            return section;
          }
        }
      });
      const updatedSections = notCategories.concat(allCategories);
      state.userBusiness.sections = updatedSections;
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
  setForegroundImg,
  removeForeground,
  editProduct,
  delProduct,
} = businessSlice.actions;
export default businessSlice.reducer;
