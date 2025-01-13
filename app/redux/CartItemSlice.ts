import { createSlice } from "@reduxjs/toolkit";
import {
  Cart,
  CartItem,
  DiscountedProducts,
  product,
  voucherProduct,
} from "../utilities/Types";

const defaultCartHolderItem: CartItem[] = [];
const defaultdiscountedProducts: DiscountedProducts[] = [];
const defaultvoucherProducts: voucherProduct[] = [];
const defaultCartHolderItemInfo: {
  business_id?: string;
  totalPrice?: number;
  deliveryCost?: number;
  grandTotal?: number;
}[] = [];
const initialState = {
  defaultCartHolderItem: defaultCartHolderItem,
  defaultCartHolderItemInfo: defaultCartHolderItemInfo,
  totalPrice: 0,
  deliveryCost: 0,
  Total: 0,
  grandTotal: 0,
  discountedProducts: defaultdiscountedProducts,
  voucherProducts: defaultvoucherProducts,
};
const CartHolderItemsSlice = createSlice({
  name: "CartHolderItmes",
  initialState,
  reducers: {
    delCart: (
      state,
      action: {
        payload: {
          product: product;
          currentPrice: number;
          currentPriceDelivery: number;
        };
      }
    ) => {
      const data = action.payload;
      const cartHolderIndex = state.defaultCartHolderItemInfo.findIndex(
        (info) => {
          return info.business_id === data.product.store_id;
        }
      );
      console.log("cart index : ", cartHolderIndex);
      console.log("cart info :", defaultCartHolderItemInfo[cartHolderIndex]);

      state.defaultCartHolderItemInfo[cartHolderIndex].deliveryCost! -=
        data.currentPriceDelivery;
      state.defaultCartHolderItemInfo[cartHolderIndex].totalPrice! -=
        data.currentPrice;
      state.defaultCartHolderItemInfo[cartHolderIndex].grandTotal! =
        state.defaultCartHolderItemInfo[cartHolderIndex].deliveryCost! +
        state.defaultCartHolderItemInfo[cartHolderIndex].totalPrice!;
      const fp = data.currentPrice + data.currentPriceDelivery;
      state.Total = state.Total - fp;

      if (state.defaultCartHolderItem[cartHolderIndex].products?.length == 1) {
        state.defaultCartHolderItemInfo.splice(cartHolderIndex, 1);
      }

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
    increment: (state, action) => {
      const product: product = action.payload;
      const index = state.discountedProducts.findIndex(
        (p) => p.product.id === product.id
      );
      const price =
        index === -1 ? product.price! : state.discountedProducts[index].price!;
      const delivery_cost = product.delivery_cost!;
      const cartHolderIndex = state.defaultCartHolderItemInfo.findIndex(
        (info) => {
          return info.business_id === product.store_id;
        }
      );
      console.log("cart index : ", cartHolderIndex);
      console.log("cart info :", defaultCartHolderItemInfo[cartHolderIndex]);

      state.defaultCartHolderItemInfo[cartHolderIndex].deliveryCost! +=
        delivery_cost;
      state.defaultCartHolderItemInfo[cartHolderIndex].totalPrice! += price;
      state.defaultCartHolderItemInfo[cartHolderIndex].grandTotal! =
        state.defaultCartHolderItemInfo[cartHolderIndex].deliveryCost! +
        state.defaultCartHolderItemInfo[cartHolderIndex].totalPrice!;
      const p = price + product.delivery_cost!!;
      state.Total = state.Total + p;
    },
    decrement: (state, action) => {
      const product: product = action.payload;
      const index = state.discountedProducts.findIndex(
        (p) => p.product.id === product.id
      );
      const price =
        index === -1 ? product.price! : state.discountedProducts[index].price!;
      const delivery_cost = product.delivery_cost!;
      const cartHolderIndex = state.defaultCartHolderItemInfo.findIndex(
        (info) => info.business_id === product.store_id
      );
      state.defaultCartHolderItemInfo[cartHolderIndex].deliveryCost! -=
        delivery_cost;
      state.defaultCartHolderItemInfo[cartHolderIndex].totalPrice! -= price;
      state.defaultCartHolderItemInfo[cartHolderIndex].grandTotal! =
        state.defaultCartHolderItemInfo[cartHolderIndex].deliveryCost! +
        state.defaultCartHolderItemInfo[cartHolderIndex].totalPrice!;
      const p = price + product.delivery_cost!!;
      state.Total = state.Total - p;
    },
    addCart: (state, action) => {
      const item: CartItem = action.payload;
      const productId = item.products![0].id;
      const businessId = item.business?.id;
      let addToTotal = false;
      const index = state.discountedProducts.findIndex(
        (p) => p.product.id === productId
      );
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

      if (CartHolderMap.has(businessId)) {
        const CartHolder = CartHolderMap.get(businessId)!;

        const productSet = new Set(
          CartHolder.products!.map((product) => product.id)
        );

        if (!productSet.has(productId)) {
          addToTotal = true;
          CartHolder.products!.push(item.products![0]);
          const cartIndex = state.defaultCartHolderItemInfo.findIndex(
            (info) => info.business_id === item.business?.id
          );
          console.log("cart index : ", cartIndex);
          console.log(
            "cart info :",
            state.defaultCartHolderItemInfo[cartIndex]
          );
          state.defaultCartHolderItemInfo[cartIndex].deliveryCost! +=
            item.products![0].delivery_cost!!;
          state.defaultCartHolderItemInfo[cartIndex].totalPrice! += price;
          state.defaultCartHolderItemInfo[cartIndex].grandTotal! =
            state.defaultCartHolderItemInfo[cartIndex].totalPrice! +
            state.defaultCartHolderItemInfo[cartIndex].deliveryCost!;
        }
      } else {
        addToTotal = true;
        state.defaultCartHolderItem.push(item);
        const index = state.discountedProducts.findIndex(
          (p) => p.product.id === productId
        );
        const totalPrice = price;
        const deliveryCost = item.products![0].delivery_cost!!;
        const grandTotal = +deliveryCost + price;
        state.defaultCartHolderItemInfo.push({
          business_id: item.business?.id,
          deliveryCost,
          grandTotal,
          totalPrice,
        });
      }

      console.log("revcived business : ", item.business);
      console.log("revcived state products : ", state.discountedProducts);
      console.log("Product ID:", productId);
      console.log("Discounted Products:", state.discountedProducts);
      console.log("Index Found:", index);

      console.log("cart holder info", state.defaultCartHolderItemInfo);
      console.log("cart holders ", state.defaultCartHolderItem);
      if (addToTotal) {
        state.Total = state.Total + price + item.products![0].delivery_cost!!;
      }
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
  },
});
export const {
  addDiscountProduct,
  addVoucherProduct,
  setDiscountProduct,
  setvoucherProduct,
  addCart,
  decrement,
  delCart,
  increment,
} = CartHolderItemsSlice.actions;
export default CartHolderItemsSlice.reducer;
