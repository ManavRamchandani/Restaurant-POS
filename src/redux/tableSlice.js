import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  floors: {
    floor1: {
      tables: [
        {
          id: 1,
          name: "1",
          status: "available",
          locked: false,
          position: { x: 0, y: 0 },
          members: 0,
        },
        {
          id: 2,
          name: "2",
          status: "occupied",
          locked: false,
          position: { x: 100, y: 0 },
          members: 6,
        },
        {
          id: 3,
          name: "3",
          status: "reserved",
          locked: false,
          position: { x: 200, y: 0 },
          members: 0,
        },
      ],
      isAdjustmentMode: false,
    },
    floor2: {
      tables: [], // Start with an empty floor plan for floor 2
      isAdjustmentMode: false,
    },
  },
  currentFloor: 'floor1', // Default to Floor 1
};

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    switchFloor(state, action) {
      state.currentFloor = action.payload;
    },
    updateTablePosition(state, action) {
      const { id, position } = action.payload;
      const table = state.floors[state.currentFloor].tables.find((table) => table.id === id);
      if (table) {
        table.position = position;
      }
    },
    removeTable(state, action) {
      const { id, floor } = action.payload;
      state.floors[floor].tables = state.floors[floor].tables.filter((table) => table.id !== id);
    },
    addNewTable(state) {
      const newTable = {
        id: state.floors[state.currentFloor].tables.length + 1,
        name: (state.floors[state.currentFloor].tables.length + 1).toString(),
        status: "available",
        locked: false,
        position: { x: 0, y: 0 },
        members: 0,
      };
      state.floors[state.currentFloor].tables.push(newTable);
    },
    toggleAdjustmentMode(state) {
      state.floors[state.currentFloor].isAdjustmentMode = !state.floors[state.currentFloor].isAdjustmentMode;
    },
    toggleTableLock(state, action) {
      const table = state.floors[state.currentFloor].tables.find((table) => table.id === action.payload);
      if (table) {
        table.locked = !table.locked;
      }
    },
    updateTableMembers(state, action) {
      const { id, members } = action.payload;
      const table = state.floors[state.currentFloor].tables.find((table) => table.id === id);
      if (table) {
        table.members = members;
      }
    },
    updateTableStatus(state, action) {
      const { id, status } = action.payload;
      const table = state.floors[state.currentFloor].tables.find((table) => table.id === id);
      if (table) {
        table.status = status;
      }
    },
    clearTable(state, action) {
      const { tableId } = action.payload;
      const table = state.floors[state.currentFloor].tables.find((table) => table.id === tableId);
      if (table) {
        table.status = "available";
        table.members = 0;
      }
    },
    resetTables(state) {
      // Reset tables for the current floor to initial state
      state.floors[state.currentFloor].tables = initialState.floors[state.currentFloor].tables.map(table => ({
        ...table,
        status: "available",
        members: 0,
      }));
    },
  },
});

export const {
  switchFloor,
  updateTablePosition,
  addNewTable,
  toggleAdjustmentMode,
  toggleTableLock,
  updateTableMembers,
  updateTableStatus,
  clearTable,
  removeTable,
  resetTables, // Export resetTables action
} = tablesSlice.actions;

export const selectTables = (state) => state.tables.floors[state.tables.currentFloor].tables;
export const selectIsAdjustmentMode = (state) => state.tables.floors[state.tables.currentFloor].isAdjustmentMode;
export const selectCurrentFloor = (state) => state.tables.currentFloor;

export default tablesSlice.reducer;
