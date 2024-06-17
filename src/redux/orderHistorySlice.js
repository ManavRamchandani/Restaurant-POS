// src/redux/orderHistorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pastOrders: [],
};

const orderHistorySlice = createSlice({
    name: 'orderHistory',
    initialState,
    reducers: {
        clearTableOrder: (state, action) => {
            state.pastOrders.push(action.payload);
        },
    },
});

export const { clearTableOrder } = orderHistorySlice.actions;
export const selectOrderHistory = (state) => state.orderHistory.pastOrders;
export default orderHistorySlice.reducer;
