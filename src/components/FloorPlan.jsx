// src/components/FloorPlan.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateTablePosition, addNewTable, toggleAdjustmentMode, toggleTableLock, updateTableMembers, updateTableStatus, selectTables, selectIsAdjustmentMode } from '../redux/tableSlice';
import Draggable from 'react-draggable';
import tableChairImage from '../assets/table-chair.png';
import TableModal from './TableModel';

const FloorPlan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tables = useSelector(selectTables);
  const isAdjustmentMode = useSelector(selectIsAdjustmentMode);
  const [selectedTable, setSelectedTable] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleTableClick = (table) => {
    if (!isAdjustmentMode) {
      setSelectedTable(table);
    }
  };

  const updatePosition = (id, position) => {
    dispatch(updateTablePosition({ id, position }));
  };

  const closeModal = () => {
    setSelectedTable(null);
  };

  const saveTableDetails = (table) => {
    dispatch(updateTableMembers({ id: table.id, members: table.members }));
    dispatch(updateTableStatus({ id: table.id, status: table.status }));
    closeModal();
    // Navigate to /pos with table data
    navigate('/pos', { state: { table } });
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

  const filteredTables = tables.filter(table => filter === 'all' || table.status === filter);

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
            onClick={() => dispatch(addNewTable())}
          >
            + New Table
          </button>
          <button
            className={`p-3 rounded-full shadow-lg ${isAdjustmentMode ? 'bg-red-600' : 'bg-green-600'} text-white`}
            onClick={() => dispatch(toggleAdjustmentMode())}
          >
            {isAdjustmentMode ? 'Exit Adjustment Mode' : 'Enter Adjustment Mode'}
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
              style={{ zIndex: table.locked ? 1 : 1000 }}
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
