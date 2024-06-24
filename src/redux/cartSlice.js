import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const initialState = {
  tables: {},
  totalAmount: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      const { tableId, item, size, price } = action.payload;
      if (!state.tables[tableId]) {
        state.tables[tableId] = [];
        state.totalAmount[tableId] = 0;
      }
      const cartItem = state.tables[tableId].find(
        (cartItem) => cartItem.id === item.id && cartItem.size === size
      );
      if (cartItem) {
        cartItem.quantity += 1;
        cartItem.totalAmount += parseInt(price);
      } else {
        state.tables[tableId].push({
          ...item,
          size,
          price,
          quantity: 1,
          totalAmount: price,
        });
      }
      state.totalAmount[tableId] += parseInt(price);
    },
    removeProduct: (state, action) => {
      const { tableId, id, size } = action.payload;
      const cartItem = state.tables[tableId].find(
        (cartItem) => cartItem.id === id && cartItem.size === size
      );
      if (cartItem) {
        state.totalAmount[tableId] -= cartItem.totalAmount;
        state.tables[tableId] = state.tables[tableId].filter(
          (cartItem) => cartItem.id !== id || cartItem.size !== size
        );
      }
    },
    increaseQuantity: (state, action) => {
      const { tableId, id, size } = action.payload;
      const cartItem = state.tables[tableId].find(
        (cartItem) => cartItem.id === id && cartItem.size === size
      );
      if (cartItem) {
        cartItem.quantity += 1;
        cartItem.totalAmount += cartItem.price;
        state.totalAmount[tableId] += cartItem.price;
      }
    },
    decreaseQuantity: (state, action) => {
      const { tableId, id, size } = action.payload;
      const cartItem = state.tables[tableId].find(
        (cartItem) => cartItem.id === id && cartItem.size === size
      );
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        cartItem.totalAmount -= cartItem.price;
        state.totalAmount[tableId] -= cartItem.price;
      }
    },
    clearTableCart: (state, action) => {
      const { tableId } = action.payload;
      state.tables[tableId] = [];
      state.totalAmount[tableId] = 0;
    },
  },
});

export const {
  addProductToCart,
  removeProduct,
  increaseQuantity,
  decreaseQuantity,
  clearTableCart,
} = cartSlice.actions;

// Memoized selectors
export const selectCartState = (state) => state.cart;

export const selectCart = createSelector(
  [selectCartState, (_, tableId) => tableId],
  (cart, tableId) => cart.tables[tableId] || []
);

export const selectTotalAmount = createSelector(
  [selectCartState, (_, tableId) => tableId],
  (cart, tableId) => cart.totalAmount[tableId] || 0
);

export default cartSlice.reducer;
