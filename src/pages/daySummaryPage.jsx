import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';

function DaySummaryPage() {
  const [orders, setOrders] = useState([]);
  const [packedOrders, setPackedOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const ordersData = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const packedOrdersData = JSON.parse(localStorage.getItem('packedOrders')) || [];
    setOrders(ordersData);
    setPackedOrders(packedOrdersData);

    const allOrders = [...ordersData, ...packedOrdersData];
    const totalItems = allOrders.reduce((acc, order) => acc + order.items.length, 0);
    const totalRevenue = allOrders.reduce((acc, order) => acc + order.totalBillAmount, 0);

    setTotalOrders(allOrders.length);
    setTotalItemsSold(totalItems);
    setTotalRevenue(totalRevenue);
  }, []);

  return (
    <MainLayout>
      <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-start">
        <div className="max-w-screen-lg bg-white p-6 rounded-lg shadow-md w-full">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Day Summary</h1>
          <div className="text-center mb-4">
            <p>Total Orders: {totalOrders}</p>
            <p>Total Items Sold: {totalItemsSold}</p>
            <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Packed Orders</h2>
            {packedOrders.length > 0 ? (
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
                  {packedOrders.map((order, index) => (
                    <tr key={index} className="bg-gray-900 text-gray-300">
                      <td className="p-2 border border-gray-700">{order.id}</td>
                      <td className="p-2 border border-gray-700">{order.tableNumber}</td>
                      <td className="p-2 border border-gray-700">{order.time}</td>
                      <td className="p-2 border border-gray-700">{order.customerName}</td>
                      <td className="p-2 border border-gray-700">{order.mobile}</td>
                      <td className="p-2 border border-gray-700">{order.totalBillAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">No packed orders</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default DaySummaryPage;
