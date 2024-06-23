import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateTablePosition,
  addNewTable,
  toggleAdjustmentMode,
  updateTableMembers,
  updateTableStatus,
  removeTable,
  selectTables,
  selectIsAdjustmentMode,
  switchFloor,
  selectCurrentFloor,
  resetTables, // Import the resetTables action
} from '../redux/tableSlice';
import Draggable from 'react-draggable';
import tableChairImage from '../assets/table-chair.png';
import TableModal from './TableModel';

const FloorPlan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tables = useSelector(selectTables);
  const isAdjustmentMode = useSelector(selectIsAdjustmentMode);
  const currentFloor = useSelector(selectCurrentFloor);
  const [selectedTable, setSelectedTable] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

  const handleTableClick = (table) => {
    if (!isAdjustmentMode) {
      setSelectedTable(table);
      if (table.status === 'occupied') {
        navigate('/pos', { state: { table } });
      }
    } else {
      setSelectedTable(null);
    }
  };

  const updatePosition = (id, position) => {
    dispatch(updateTablePosition({ id, position, floor: currentFloor })); // Include floor parameter
  };

  const closeModal = () => {
    setSelectedTable(null);
  };

  const saveTableDetails = (table) => {
    dispatch(updateTableMembers({ id: table.id, members: table.members, floor: currentFloor })); // Include floor parameter
    dispatch(updateTableStatus({ id: table.id, status: table.status, floor: currentFloor })); // Include floor parameter
    closeModal();
    if (table.status === 'occupied') {
      navigate('/pos', { state: { table } });
    }
  };

  const removeTableHandler = (id) => {
    dispatch(removeTable({ id, floor: currentFloor })); // Include floor parameter
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'border-green-500';
      case 'occupied':
        return 'border-red-500';
      case 'reserved':
        return 'border-yellow-500';
      default:
        return 'border-gray-500';
    }
  };

  const filteredTables = tables.filter((table) => filter === 'all' || table.status === filter);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFloorSelect = (floor) => {
    dispatch(switchFloor(floor));
    setIsDropdownOpen(false); // Close dropdown after selecting a floor
  };

  const handleResetTables = () => {
    dispatch(resetTables()); // Dispatch the resetTables action to reset table data
    setSelectedTable(null); // Clear selected table
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="mr-2">Filter Tables: </label>
          <select className="p-2 border rounded" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
            onClick={() => dispatch(addNewTable({ floor: currentFloor }))} // Include floor parameter
          >
            + New Table
          </button>
          <button
            className={`p-3 rounded-full shadow-lg ${isAdjustmentMode ? 'bg-red-600' : 'bg-green-600'} text-white`}
            onClick={() => dispatch(toggleAdjustmentMode({ floor: currentFloor }))} // Include floor parameter
          >
            {isAdjustmentMode ? 'Exit Adjustment Mode' : 'Enter Adjustment Mode'}
          </button>
          <div className="relative">
            <button
              className="bg-gray-600 text-white p-3 rounded-full shadow-lg"
              onClick={toggleDropdown} // Toggle dropdown visibility
            >
              {currentFloor === 'floor1' ? 'Floor 1' : 'Floor 2'} {/* Display current floor name */}
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 w-36 rounded-lg shadow-lg bg-white border border-gray-300">
                <button
                  className={`block w-full py-2 px-4 text-left ${currentFloor === 'floor1' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                  onClick={() => handleFloorSelect('floor1')}
                >
                  Floor 1
                </button>
                <button
                  className={`block w-full py-2 px-4 text-left ${currentFloor === 'floor2' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                  onClick={() => handleFloorSelect('floor2')}
                >
                  Floor 2
                </button>
              </div>
            )}
          </div>
          <button
            className="bg-gray-600 text-white p-3 rounded-full shadow-lg"
            onClick={handleResetTables} // Reset tables button
          >
            Reset
          </button>
        </div>
      </div>
      <div className="relative">
        {filteredTables.map((table) => (
          <Draggable
            key={table.id}
            position={table.position}
            onStop={(e, data) => updatePosition(table.id, { x: data.x, y: data.y })}
            disabled={!isAdjustmentMode || table.locked}
          >
            <div
              className="absolute cursor-move"
              style={{
                zIndex: table.locked ? 1 : 1,
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <img
                src={tableChairImage}
                alt={`Table ${table.name}`}
                className={`p-2 cursor-pointer border-2 rounded-lg ${getStatusColor(table.status)}`}
                style={{ width: '250px', height: '100px' }}
                onClick={() => handleTableClick(table)}
              />
              <div className="text-center font-bold">
                {table.name}
              </div>
              {isAdjustmentMode && (
                <button
                  className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => removeTableHandler(table.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </Draggable>
        ))}
      </div>
      {selectedTable && !isAdjustmentMode && (
        <TableModal
          table={selectedTable}
          onClose={closeModal}
          onSave={saveTableDetails}
        />
      )}
    </div>
  );
};

export default FloorPlan;
