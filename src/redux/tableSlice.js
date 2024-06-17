// src/redux/tablesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tables: [
    { id: 1, name: '1', status: 'available', locked: false, position: { x: 0, y: 0 }, members: 0 },
    { id: 2, name: '2', status: 'occupied', locked: false, position: { x: 100, y: 0 }, members: 6 },
    { id: 3, name: '3', status: 'reserved', locked: false, position: { x: 200, y: 0 }, members: 0 },
  ],
  isAdjustmentMode: false,
};

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    updateTablePosition(state, action) {
      const { id, position } = action.payload;
      const table = state.tables.find((table) => table.id === id);
      if (table) {
        table.position = position;
      }
    },
    addNewTable(state) {
      const newTable = {
        id: state.tables.length + 1,
        name: (state.tables.length + 1).toString(),
        status: 'available',
        locked: false,
        position: { x: 0, y: 0 },
        members: 0,
      };
      state.tables.push(newTable);
    },
    toggleAdjustmentMode(state) {
      state.isAdjustmentMode = !state.isAdjustmentMode;
    },
    toggleTableLock(state, action) {
      const table = state.tables.find((table) => table.id === action.payload);
      if (table) {
        table.locked = !table.locked;
      }
    },
    updateTableMembers(state, action) { // Corrected export name
      const { id, members } = action.payload;
      const table = state.tables.find((table) => table.id === id);
      if (table) {
        table.members = members;
      }
    },
    updateTableStatus(state, action) {
      const { id, status } = action.payload;
      const table = state.tables.find((table) => table.id === id);
      if (table) {
        table.status = status;
      }
    },
  },
});

export const { updateTablePosition, addNewTable, toggleAdjustmentMode, toggleTableLock, updateTableMembers, updateTableStatus } = tablesSlice.actions; // Include updateTableMembers in exports

export const selectTables = (state) => state.tables.tables;
export const selectIsAdjustmentMode = (state) => state.tables.isAdjustmentMode;

export default tablesSlice.reducer;