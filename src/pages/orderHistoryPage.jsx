import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { toast } from 'react-toastify';

function OrderHistoryPage() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [filteredOrderHistory, setFilteredOrderHistory] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCanceledOrders, setShowCanceledOrders] = useState(false);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const canceled = JSON.parse(localStorage.getItem('canceledOrders')) || [];
    setOrderHistory(history);
    setFilteredOrderHistory(history);
    setCanceledOrders(canceled);
  }, []);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredOrderHistory(orderHistory);
    } else {
      const filtered = orderHistory.filter((order) =>
        order.customerName.toLowerCase().includes(term) ||
        order.id.toString().includes(term)
      );
      setFilteredOrderHistory(filtered);
    }
  };

  const handleDeleteOrder = () => {
    const updatedOrderHistory = orderHistory.filter(order => order.id !== selectedOrder.id);
    const updatedCanceledOrders = [...canceledOrders, selectedOrder];

    setOrderHistory(updatedOrderHistory);
    setFilteredOrderHistory(updatedOrderHistory);
    setCanceledOrders(updatedCanceledOrders);

    localStorage.setItem('orderHistory', JSON.stringify(updatedOrderHistory));
    localStorage.setItem('canceledOrders', JSON.stringify(updatedCanceledOrders));

    setShowPopup(false);
    toast.success('Order has been canceled', { autoClose: 2000 });
  };

  return (
    <MainLayout>
      <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-start">
        <div className="max-w-screen-lg bg-white p-6 rounded-lg shadow-md w-full">
          <div className="flex justify-between mb-4">
            <h1 className="text-4xl font-bold text-center text-blue-600">Order History</h1>
            <button
              className="py-2 px-4 bg-red-600 text-white rounded-md"
              onClick={() => setShowCanceledOrders(!showCanceledOrders)}
            >
              {showCanceledOrders ? 'Back to Orders' : 'Canceled Orders'}
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by Order ID or Customer Name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {(showCanceledOrders ? canceledOrders : filteredOrderHistory).length > 0 ? (
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-2 border border-gray-700">Order ID</th>
                  <th className="p-2 border border-gray-700">Table No.</th>
                  <th className="p-2 border border-gray-700">Time</th>
                  <th className="p-2 border border-gray-700">Name</th>
                  <th className="p-2 border border-gray-700">Mobile</th>
                  <th className="p-2 border border-gray-700">Total Bill Amount</th>
                </tr>
              </thead>
              <tbody>
                {(showCanceledOrders ? canceledOrders : filteredOrderHistory).map((order, index) => (
                  <tr
                    key={index}
                    className="bg-gray-900 text-gray-300 cursor-pointer"
                    onClick={() => handleRowClick(order)}
                  >
                    <td className="p-2 border border-gray-700">{order.id}</td>
                    <td className="p-2 border border-gray-700">{order.tableName}</td>
                    <td className="p-2 border border-gray-700">{new Date(order.date).toLocaleString()}</td>
                    <td className="p-2 border border-gray-700">{order.customerName}</td>
                    <td className="p-2 border border-gray-700">{order.customerPhone}</td>
                    <td className="p-2 border border-gray-700">Rs. {order.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>{showCanceledOrders ? 'No canceled orders found.' : 'No order history found.'}</p>
          )}
        </div>
      </div>

      {showPopup && selectedOrder && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-3/4">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Table:</strong> {selectedOrder.tableName}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
            <p><strong>Mobile Number:</strong> {selectedOrder.customerPhone}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
            <h3 className="text-xl font-bold mt-4">Items:</h3>
            <ul className="list-disc list-inside">
              {selectedOrder.cart.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {item.name} - {item.size} - Rs. {item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <p className="mt-4"><strong>Total Amount:</strong> Rs. {selectedOrder.totalAmount}</p>
            <div className="flex justify-end mt-4">
              <button
                className="mr-4 py-2 px-4 bg-red-600 text-white rounded-md"
                onClick={handleDeleteOrder}
              >
                Cancel Order
              </button>
              <button
                className="py-2 px-4 bg-gray-600 text-white rounded-md"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default OrderHistoryPage;
