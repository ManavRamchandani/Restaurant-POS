// src/pages/OrderHistory.js
import React from 'react';
import MainLayout from '../layouts/MainLayout';

const OrderHistory = () => {
  const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

  return (
    <MainLayout>
      <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-start">
        <div className="max-w-screen-lg bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
            Order History
          </h1>
          {orderHistory.length > 0 ? (
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-2 border border-gray-700">Table</th>
                  <th className="p-2 border border-gray-700">Items</th>
                  <th className="p-2 border border-gray-700">Total Amount</th>
                  <th className="p-2 border border-gray-700">Order Details</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((order, index) => (
                  <tr key={index} className="bg-gray-900 text-gray-300">
                    <td className="p-2 border border-gray-700">{order.table}</td>
                    <td className="p-2 border border-gray-700">
                      {order.items.map((item, i) => (
                        <div key={i}>
                          {item.name} ({item.size}) - Rs. {item.price} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-2 border border-gray-700">{order.totalAmount}</td>
                    <td className="p-2 border border-gray-700">
                      <div>Name: {order.orderDetails.name}</div>
                      <div>Phone: {order.orderDetails.phone}</div>
                      <div>Time: {order.orderDetails.time}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No order history found</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderHistory;
