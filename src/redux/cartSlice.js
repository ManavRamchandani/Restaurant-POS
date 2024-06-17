// src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      const { item, size, price } = action.payload;
      const existingProduct = state.cart.find(
        (product) => product.id === item.id && product.size === size
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalAmount += price;
      } else {
        state.cart.push({
          ...item,
          size,
          price,
          quantity: 1,
          totalAmount: price,
        });
      }

      state.totalAmount += price;
    },
    removeProduct: (state, action) => {
      const { id, size } = action.payload;
      const productIndex = state.cart.findIndex(
        (product) => product.id === id && product.size === size
      );

      if (productIndex >= 0) {
        const product = state.cart[productIndex];
        state.totalAmount -= product.totalAmount;
        state.cart.splice(productIndex, 1);
      }
    },
    increaseQuantity: (state, action) => {
      const { id, size } = action.payload;
      const product = state.cart.find(
        (product) => product.id === id && product.size === size
      );

      if (product) {
        product.quantity += 1;
        product.totalAmount += product.price;
        state.totalAmount += product.price;
      }
    },
    decreaseQuantity: (state, action) => {
      const { id, size } = action.payload;
      const product = state.cart.find(
        (product) => product.id === id && product.size === size
      );

      if (product && product.quantity > 1) {
        product.quantity -= 1;
        product.totalAmount -= product.price;
        state.totalAmount -= product.price;
      }
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalAmount = 0;
    },
  },
});

export const {
  addProductToCart,
  removeProduct,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;
export const selectTotalAmount = (state) => state.cart.totalAmount;

export default cartSlice.reducer;
