import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'

function DaySummaryPage() {
  const [daySummary, setDaySummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalItemsSold: 0,
    totalCustomers: 0,
    orders: []
  });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = history.filter(order => new Date(order.date).toISOString().slice(0, 10) === today);

    const totalSales = todayOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalItemsSold = todayOrders.reduce((acc, order) => acc + order.cart.reduce((acc, item) => acc + item.quantity, 0), 0);

    setDaySummary({
      totalSales,
      totalOrders: todayOrders.length,
      totalItemsSold,
      totalCustomers: new Set(todayOrders.map(order => order.customerName)).size,
      orders: todayOrders
    });
  }, []);

  return (
    <MainLayout>
      <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-start">
        <div className="max-w-screen-lg bg-white p-6 rounded-lg shadow-md w-full">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
            Day Summary
          </h1>
          <div className="mb-4">
            <p><strong>Total Sales:</strong> Rs. {daySummary.totalSales}</p>
            <p><strong>Total Orders:</strong> {daySummary.totalOrders}</p>
            <p><strong>Total Items Sold:</strong> {daySummary.totalItemsSold}</p>
            <p><strong>Total Customers:</strong> {daySummary.totalCustomers}</p>
          </div>
          {daySummary.orders.length > 0 ? (
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
                {daySummary.orders.map((order, index) => (
                  <tr key={index} className="bg-gray-900 text-gray-300">
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
            <p>No orders found for today.</p>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default DaySummaryPage
