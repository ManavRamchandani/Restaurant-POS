// src/components/TableModal.js
import React, { useState, useEffect } from 'react';

const TableModal = ({ table, onClose, onSave }) => {
  const [members, setMembers] = useState(table.members);
  const [status, setStatus] = useState(table.status);

  const handleSave = () => {
    const updatedTable = { ...table, members, status };
    onSave(updatedTable);
  };

  useEffect(() => {
    setMembers(table.members);
    setStatus(table.status);
  }, [table]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg z-50">
        <h2 className="text-xl font-bold mb-4">Table {table.name}</h2>
        <div className="mb-4">
          <label className="block mb-2">Number of Members</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={members}
            onChange={(e) => setMembers(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select
            className="border p-2 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableModal;