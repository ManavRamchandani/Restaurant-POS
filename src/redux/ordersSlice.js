import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newOrders: [],
  preparingOrders: [],
  packedOrders: [],
  orderHistory: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addNewOrder: (state, action) => {
      state.newOrders.push(action.payload);
    },
    moveToPreparing(state, action) {
      const orderId = action.payload;
      const orderIndex = state.newOrders.findIndex((order) => order.id === orderId);
      if (orderIndex !== -1) {
        const order = state.newOrders.splice(orderIndex, 1)[0];
        order.status = "Preparing";
        state.preparingOrders.push(order);
      }
    },
    moveToPacked(state, action) {
      const orderId = action.payload;
      const orderIndex = state.preparingOrders.findIndex((order) => order.id === orderId);
      if (orderIndex !== -1) {
        const order = state.preparingOrders.splice(orderIndex, 1)[0];
        order.status = "Packed";
        state.packedOrders.push(order);
      }
    },
    moveToOrderHistory(state, action) {
      const orderId = action.payload;
      const orderIndex = state.packedOrders.findIndex((order) => order.id === orderId);
      if (orderIndex !== -1) {
        const order = state.packedOrders.splice(orderIndex, 1)[0];
        order.status = "Completed";
        state.orderHistory.push(order);
      }
    },
    updateOrder(state, action) {
      const updatedOrder = action.payload;
      const orderIndex = state.newOrders.findIndex((order) => order.id === updatedOrder.id);
      if (orderIndex !== -1) {
        state.newOrders[orderIndex] = updatedOrder;
      }
    },
  },
});

export const { addNewOrder, moveToPreparing, moveToPacked, moveToOrderHistory, updateOrder } =
  ordersSlice.actions;

export const getOrderById = (state, orderId) => {
  return (
    state.orders.newOrders.find((order) => order.id === orderId) ||
    state.orders.preparingOrders.find((order) => order.id === orderId) ||
    state.orders.packedOrders.find((order) => order.id === orderId) ||
    state.orders.orderHistory.find((order) => order.id === orderId) ||
    null
  );
};

export default ordersSlice.reducer;
