// src/redux/tablesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tables: [],
  isAdjustmentMode: false,
};

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.tables = action.payload;
    },
    occupyTable: (state, action) => {
      const table = state.tables.find((table) => table.id === action.payload);
      if (table) {
        table.status = 'occupied';
      }
    },
    releaseTable: (state, action) => {
      const table = state.tables.find((table) => table.id === action.payload);
      if (table) {
        table.status = 'available';
      }
    },
    toggleAdjustmentMode: (state) => {
      state.isAdjustmentMode = !state.isAdjustmentMode;
    },
  },
});

export const { setTables, occupyTable, releaseTable, toggleAdjustmentMode } =
  tablesSlice.actions;

export const selectTables = (state) => state.tables.tables;
export const selectIsAdjustmentMode = (state) => state.tables.isAdjustmentMode;

export default tablesSlice.reducer;
