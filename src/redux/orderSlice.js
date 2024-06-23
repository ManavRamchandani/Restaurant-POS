import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchOrderHistory = createAsyncThunk('orders/fetchOrderHistory', async () => {
  const response = await axios.get('http://localhost:3000/orders');
  return response.data;
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderId) => {
  await axios.delete(`http://localhost:3000/orders/${orderId}`);
  return orderId;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orderHistory: [],
    canceledOrders: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderHistory = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const orderId = action.payload;
        const orderIndex = state.orderHistory.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          const canceledOrder = state.orderHistory.splice(orderIndex, 1)[0];
          state.canceledOrders.push(canceledOrder);
        }
      });
  },
});

export const selectOrderHistory = (state) => state.orders.orderHistory;
export const selectCanceledOrders = (state) => state.orders.canceledOrders;

export default orderSlice.reducer;
