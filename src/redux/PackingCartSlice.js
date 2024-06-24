import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  packingCarts: [],
};

const packingCartSlice = createSlice({
  name: 'packingCart',
  initialState,
  reducers: {
    addProductToPackingCart: (state, action) => {
      const { item, size, price } = action.payload;
      const existingItem = state.packingCarts.find(
        (cartItem) => cartItem.id === item.id && cartItem.size === size
      );
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalAmount = existingItem.quantity * existingItem.price;
      } else {
        state.packingCarts.push({ ...item, size, price, quantity: 1, totalAmount: price });
      }
    },
    removeProductFromPackingCart: (state, action) => {
      const { id, size } = action.payload;
      state.packingCarts = state.packingCarts.filter(
        (cartItem) => !(cartItem.id === id && cartItem.size === size)
      );
    },
    increasePackingCartQuantity: (state, action) => {
      const { id, size } = action.payload;
      const existingItem = state.packingCarts.find(
        (cartItem) => cartItem.id === id && cartItem.size === size
      );
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalAmount = existingItem.quantity * existingItem.price;
      }
    },
    decreasePackingCartQuantity: (state, action) => {
      const { id, size } = action.payload;
      const existingItem = state.packingCarts.find(
        (cartItem) => cartItem.id === id && cartItem.size === size
      );
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        existingItem.totalAmount = existingItem.quantity * existingItem.price;
      }
    },
    clearPackingCart: (state) => {
      state.packingCarts = [];
    },
  },
});

export const {
  addProductToPackingCart,
  removeProductFromPackingCart,
  increasePackingCartQuantity,
  decreasePackingCartQuantity,
  clearPackingCart,
} = packingCartSlice.actions;

export const selectPackingCart = (state) => state.packingCart.packingCarts;

export const selectPackingCartTotalAmount = (state) => {
  if (!Array.isArray(state.packingCart.packingCarts)) {
    return 0;
  }
  return state.packingCart.packingCarts.reduce((total, item) => total + item.price * item.quantity, 0);
};

export default packingCartSlice.reducer;
