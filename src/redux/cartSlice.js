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
    addProductToCart(state, action) {
      const { item, size, price } = action.payload;
      const findProductInCart = state.cart.find(
        (i) => i.id === item.id && i.size === size
      );

      if (findProductInCart) {
        state.cart = state.cart.map((cartItem) => {
          if (cartItem.id === item.id && cartItem.size === size) {
            const updatedItem = {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              totalAmount: parseInt(cartItem.totalAmount) + parseInt(price),
            };
            return updatedItem;
          }
          return cartItem;
        });
      } else {
        const newItem = {
          ...item,
          size,
          price,
          quantity: 1,
          totalAmount: price,
        };
        state.cart.push(newItem);
      }
      state.totalAmount = state.cart.reduce((acc, item) => acc + item.totalAmount, 0);
    },
    removeProduct(state, action) {
      const { id, size } = action.payload;
      state.cart = state.cart.filter(
        (cartItem) => !(cartItem.id === id && cartItem.size === size)
      );
      state.totalAmount = state.cart.reduce((acc, item) => acc + item.totalAmount, 0);
    },
    increaseQuantity(state, action) {
      const { id, size } = action.payload;
      state.cart = state.cart.map((cartItem) => {
        if (cartItem.id === id && cartItem.size === size) {
          const updatedItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            totalAmount: parseInt(cartItem.totalAmount) + parseInt(cartItem.price),
          };
          return updatedItem;
        }
        return cartItem;
      });
      state.totalAmount = state.cart.reduce((acc, item) => acc + item.totalAmount, 0);
    },
    decreaseQuantity(state, action) {
      const { id, size } = action.payload;
      state.cart = state.cart
        .map((cartItem) => {
          if (cartItem.id === id && cartItem.size === size) {
            const updatedItem = {
              ...cartItem,
              quantity: cartItem.quantity - 1,
              totalAmount: parseInt(cartItem.totalAmount) - parseInt(cartItem.price),
            };
            return updatedItem.quantity > 0 ? updatedItem : null;
          }
          return cartItem;
        })
        .filter((cartItem) => cartItem !== null);
      state.totalAmount = state.cart.reduce((acc, item) => acc + item.totalAmount, 0);
    },
  },
});

export const { addProductToCart, removeProduct, increaseQuantity, decreaseQuantity } = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;
export const selectTotalAmount = (state) => state.cart.totalAmount;

export default cartSlice.reducer;