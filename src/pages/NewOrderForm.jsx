import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function NewOrderForm() {
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const navigate = useNavigate();

  const handleNewOrder = () => {
    if (!customerName) {
      toast.error('Please enter customer name');
      return;
    }

    navigate({
      pathname: '/pos',
      state: { name: customerName, mobile: customerMobile },
    });
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <input
        type="text"
        placeholder="Customer Mobile"
        value={customerMobile}
        onChange={(e) => setCustomerMobile(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        className="py-2 px-4 bg-blue-600 text-white rounded-md"
        onClick={handleNewOrder}
      >
        New Order
      </button>
    </div>
  );
}

export default NewOrderForm;
