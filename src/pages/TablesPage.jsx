import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectTables, occupyTable } from '../redux/tableSlice';

const TablesPage = () => {
  const tables = useSelector(selectTables);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTableClick = (table) => {
    if (table.status === 'available') {
      dispatch(occupyTable(table.id));
    }
    navigate('/category', { state: { table } });
  };

  return (
    <div>
      {tables.map((table) => (
        <div
          key={table.id}
          onClick={() => handleTableClick(table)}
          className={`table ${table.status}`}
        >
          {table.name}
        </div>
      ))}
    </div>
  );
};

export default TablesPage;
