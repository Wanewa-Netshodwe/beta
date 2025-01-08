import { createSlice } from "@reduxjs/toolkit";
import {
  BusinessAccount,
  BusRegData,
  category,
  DiscountedProducts,
  product,
  sectionData,
  voucherProduct,
} from "../utilities/Types";
const defaultBusRegData: BusRegData = {};

export const defaultBusiness: BusinessAccount = {
  foregroundImg:
    "https://1000logos.net/wp-content/uploads/2017/05/Color-PUMA-Logo.jpg",
  dis_auth: false,

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
const AllBusinesses: BusinessAccount[] = [];
const defaultdiscountedProducts: DiscountedProducts[] = [];
const defaultvoucherProducts: voucherProduct[] = [];
const initialState = {
  allBusinesses: AllBusinesses,
  userBusiness: defaultBusiness,
  products: products,
  wallets: [],
  busRegData: defaultBusRegData,
  discountedProducts: defaultdiscountedProducts,
  voucherProducts: defaultvoucherProducts,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setRegData: (state, action) => {
      const data: BusRegData = action.payload;
      state.busRegData = { ...data };
    },
    setDiscountProduct: (state, action) => {
      const discountedProduct: DiscountedProducts[] = action.payload;
      state.discountedProducts = discountedProduct;
    },
    setvoucherProduct: (state, action) => {
      const voucherProduct: voucherProduct[] = action.payload;
      state.voucherProducts = voucherProduct;
    },
    addVoucherProduct: (state, action) => {
      const voucherProduct: voucherProduct = action.payload;
      // const result = state.voucherProducts.findIndex(
      //   (vp) => vp.id === voucherProduct.id
      // );
      // console.log(result)
      // result === -1 ? null : state.voucherProducts.push(voucherProduct);
      state.voucherProducts.push(voucherProduct);
    },
    addDiscountProduct: (state, action) => {
      const discountedProduct: DiscountedProducts[] = action.payload;
      discountedProduct.forEach((dpro) => {
        const result = state.discountedProducts.findIndex(
          (dp) => dp.product.id === dpro.product.id
        );
        result === -1 && state.discountedProducts.push(dpro);
      });
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
    setBusinesses: (state, action) => {
      const businesses = action.payload;
      state.allBusinesses = businesses;
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
    setCategoryList: (state, action) => {
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
    setProducts: (state, action) => {
      const products = action.payload;
      state.products = products;
    },

    setWallets: (state, action) => {
      const wallets = action.payload;
      state.wallets = wallets;
    },
  },
});

export const {
  addVoucherProduct,
  setvoucherProduct,
  setBusiness,
  setProducts,
  setWallets,
  setRegData,
  addSection,
  delSection,
  setBusinesses,
  addProduct,
  setCategoryList,
  setForegroundImg,
  removeForeground,
  editProduct,
  delProduct,
  addDiscountProduct,
  setDiscountProduct,
} = businessSlice.actions;
export default businessSlice.reducer;
