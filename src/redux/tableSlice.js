import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  floors: {
    floor1: {
      tables: [
        { id: 1, name: "1", status: "available", locked: false, position: { x: 0, y: 0 }, members: 0 },
        { id: 2, name: "2", status: "occupied", locked: false, position: { x: 100, y: 0 }, members: 6 },
        { id: 3, name: "3", status: "reserved", locked: false, position: { x: 200, y: 0 }, members: 0 },
      ],
      isAdjustmentMode: false,
      highestId: 3,
    },
    floor2: {
      tables: [], 
      isAdjustmentMode: false,
      highestId: 0,
    },
  },
  currentFloor: 'floor1',
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
    addNewTable(state, action) {
      const floor = action.payload.floor;
      state.floors[floor].highestId += 1;
      const newTable = {
        id: state.floors[floor].highestId,
        name: state.floors[floor].highestId.toString(),
        status: "available",
        locked: false,
        position: { x: 0, y: 0 },
        members: 0,
      };
      state.floors[floor].tables.push(newTable);
    },
    toggleAdjustmentMode(state, action) {
      const floor = action.payload.floor;
      state.floors[floor].isAdjustmentMode = !state.floors[floor].isAdjustmentMode;
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
      state.floors[state.currentFloor].tables = initialState.floors[state.currentFloor].tables.map(table => ({
        ...table,
        status: "available",
        members: 0,
      }));
      state.floors[state.currentFloor].highestId = initialState.floors[state.currentFloor].highestId;
    },
    mergeTables(state, action) {
      const { ids, name, floor } = action.payload;
      const mergedMembers = ids.reduce((acc, id) => {
        const table = state.floors[floor].tables.find((table) => table.id === id);
        return acc + (table ? table.members : 0);
      }, 0);

      const mergedTable = {
        id: ++state.floors[floor].highestId,
        name: name,
        status: "available",
        locked: false,
        position: { x: 0, y: 0 }, 
        members: mergedMembers,
        mergedTables: ids, 
      };

      state.floors[floor].tables = state.floors[floor].tables.filter((table) => !ids.includes(table.id));
      state.floors[floor].tables.push(mergedTable);
    },
    unmergeTable(state, action) {
      const { table, floor } = action.payload;
      if (!table.mergedTables) return;

      const originalTables = table.mergedTables.map(id => {
        return {
          id: ++state.floors[floor].highestId,
          name: id.toString(),
          status: "available",
          locked: false,
          position: { x: table.position.x, y: table.position.y },
          members: 0,
        };
      });

      state.floors[floor].tables = state.floors[floor].tables.filter(t => t.id !== table.id).concat(originalTables);
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
  resetTables,
  mergeTables,
  unmergeTable,
} = tablesSlice.actions;

export const selectTables = (state) => state.tables.floors[state.tables.currentFloor].tables;
export const selectIsAdjustmentMode = (state) => state.tables.floors[state.tables.currentFloor].isAdjustmentMode;
export const selectCurrentFloor = (state) => state.tables.currentFloor;

export default tablesSlice.reducer;
