import { createSlice } from "@reduxjs/toolkit";
import {
  Cart,
  CartItem,
  DiscountedProducts,
  product,
  voucherProduct,
} from "../utilities/Types";
const defaultCart: Cart = { item: {}, total: 0 };
const defaultCartHolderItem: CartItem[] = [{}];
const defaultdiscountedProducts: DiscountedProducts[] = [];
const defaultvoucherProducts: voucherProduct[] = [];
const initialState = {
  defaultCartHolderItem: defaultCartHolderItem,
  totalPrice: 0,
  deliveryCost: 0,
  cart: defaultCart,
  grandTotal: 0,
  discountedProducts: defaultdiscountedProducts,
  voucherProducts: defaultvoucherProducts,
};
const CartHolderItemsSlice = createSlice({
  name: "CartHolderItmes",
  initialState,
  reducers: {
    delCart: (state, action: { payload: { product:product ,currentPrice: number } }) => {
      const data = action.payload;
      const p = state.grandTotal;
      state.totalPrice = state.totalPrice - data.currentPrice;
      state.grandTotal = p! - state.totalPrice;
      state.deliveryCost = state.deliveryCost - data.product.delivery_cost!;
      state.defaultCartHolderItem = state.defaultCartHolderItem
        .map((item) => {
          if (item.business?.id === data.product.store_id) {
            item.products = item.products!.filter(
              (pro) => pro.id !== data.product.id
            );
            return item;
          }
          return item;
        })
        .filter((item) => item.products!.length > 0);

      state.cart.total = state.cart.total;
      -data.currentPrice;
    },
    increment: (state, action) => {
      const product = action.payload;
      const index = state.discountedProducts.findIndex(
        (p) => p.product.id === product.id
      );
      const price =
        index === -1 ? product.price! : state.discountedProducts[index].price!;
      const delivery_cost = product.delivery_cost!;
      const p = state.cart.total;
      state.cart.total = p + price;

      state.totalPrice = state.totalPrice + price;
      state.deliveryCost = state.deliveryCost + delivery_cost;
      state.grandTotal = state.totalPrice + state.deliveryCost;
    },
    decrement: (state, action) => {
      const product = action.payload;
      const index = state.discountedProducts.findIndex(
        (p) => p.product.id === product.id
      );
      const price =
        index === -1 ? product.price! : state.discountedProducts[index].price!;
      const delivery_cost = product.delivery_cost!;
      state.totalPrice = state.totalPrice - price;
      state.deliveryCost = state.deliveryCost - delivery_cost;
      state.grandTotal = state.totalPrice - state.deliveryCost;
      const p = state.cart.total;
      state.cart.total = p! - price;
    },
    addCart: (state, action) => {
      const item = action.payload;
      const productId = item.products![0].id;
      const businessId = item.business?.id;

      const index = state.discountedProducts.findIndex(
        (p) => p.product.id === productId
      );
      console.log("Product ID:", productId);
      console.log("Discounted Products:", state.discountedProducts);
      console.log("Index Found:", index);

      const price =
        index === -1
          ? item.products![0].price!
          : state.discountedProducts[index].price!;

      const CartHolderMap = new Map(
        state.defaultCartHolderItem.map((cartItem) => [
          cartItem.business?.id,
          cartItem,
        ])
      );

      state.cart.total = state.cart.total! + price;
    },
    addVoucherProductCartHolder: (state, action) => {
      const voucherProduct: voucherProduct = action.payload;
      // const result = state.voucherProducts.findIndex(
      //   (vp) => vp.id === voucherProduct.id
      // );
      // console.log(result)
      // result === -1 ? null : state.voucherProducts.push(voucherProduct);
      state.voucherProducts.push(voucherProduct);
    },
    addDiscountProductCartHolder: (state, action) => {
      const discountedProduct: DiscountedProducts[] = action.payload;
      discountedProduct.forEach((dpro) => {
        const result = state.discountedProducts.findIndex(
          (dp) => dp.product.id === dpro.product.id
        );
        result === -1 && state.discountedProducts.push(dpro);
      });
    },
    incrementCartHolder: (state, action: { payload: product }) => {},
    decrementCartHolder: (state, action: { payload: product }) => {
      const product = action.payload;
      const index = state.discountedProducts.findIndex(
        (p) => p.product.id === product.id
      );
      const price =
        index === -1 ? product.price! : state.discountedProducts[index].price!;
      const delivery_cost = product.delivery_cost!;
      state.totalPrice = state.totalPrice - price;
      state.deliveryCost = state.deliveryCost - delivery_cost;
      state.grandTotal = state.totalPrice - state.deliveryCost;
    },
    setDiscountProductCartHolder: (state, action) => {
      const discountedProduct: DiscountedProducts[] = action.payload;
      state.discountedProducts = discountedProduct;
    },
    setvoucherProductCartHolder: (state, action) => {
      const voucherProduct: voucherProduct[] = action.payload;
      state.voucherProducts = voucherProduct;
    },
    addProductCartHolder: (state, action: { payload: CartItem }) => {
      const item = action.payload;
      const productId = item.products![0].id;
      const businessId = item.business?.id;

      const index = state.discountedProducts.findIndex(
        (p) => p.product.id === productId
      );
      console.log("Product ID:", productId);
      console.log("Discounted Products:", state.discountedProducts);
      console.log("Index Found:", index);

      const price =
        index === -1
          ? item.products![0].price!
          : state.discountedProducts[index].price!;

      const CartHolderMap = new Map(
        state.defaultCartHolderItem.map((cartItem) => [
          cartItem.business?.id,
          cartItem,
        ])
      );

      let addTotal = false;

      if (CartHolderMap.has(businessId)) {
        const CartHolder = CartHolderMap.get(businessId)!;

        const productSet = new Set(
          CartHolder.products!.map((product) => product.id)
        );

        if (!productSet.has(productId)) {
          CartHolder.products!.push(item.products![0]);
          addTotal = true;
        }
      } else {
        state.defaultCartHolderItem.push(item);
        addTotal = true;
      }

      if (addTotal) {
        state.totalPrice = (state.totalPrice ?? 0) + price;
        state.deliveryCost =
          state.totalPrice + item.products![0].delivery_cost!!;
        state.grandTotal = state.totalPrice + state.grandTotal;
      }
    },
    deleteProductCartHolder: (
      state,
      action: { payload: { product: product; currentPrice: number } }
    ) => {
      const data = action.payload;
      const p = state.grandTotal;
      state.totalPrice = state.totalPrice - data.currentPrice;
      state.grandTotal = p! - state.totalPrice;
      state.deliveryCost = state.deliveryCost - data.product.delivery_cost!;
      state.defaultCartHolderItem = state.defaultCartHolderItem
        .map((item) => {
          if (item.business?.id === data.product.store_id) {
            item.products = item.products!.filter(
              (pro) => pro.id !== data.product.id
            );
            return item;
          }
          return item;
        })
        .filter((item) => item.products!.length > 0);
    },
  },
});
export const {
  addDiscountProductCartHolder,
  addProductCartHolder,
  addVoucherProductCartHolder,
  decrementCartHolder,
  deleteProductCartHolder,
  incrementCartHolder,
  setDiscountProductCartHolder,
  setvoucherProductCartHolder,
  addCart,
  decrement,
  delCart,
  increment,
} = CartHolderItemsSlice.actions;
export default CartHolderItemsSlice.reducer;
