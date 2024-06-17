// src/pages/OrderHistoryPage.js
import React from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '../layouts/MainLayout';
import { selectOrderHistory } from '../redux/orderHistorySlice';

function OrderHistoryPage() {
    const orderHistory = useSelector(selectOrderHistory);

    return (
        <MainLayout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Order History</h1>
                {orderHistory.length === 0 ? (
                    <p>No past orders found.</p>
                ) : (
                    orderHistory.map((order, index) => (
                        <div key={index} className="mb-4 p-4 border rounded shadow-sm">
                            <h2 className="text-xl font-bold mb-2">Table: {order.table.name}</h2>
                            <p className="mb-2">Total Amount: ${order.totalAmount.toFixed(2)}</p>
                            <p className="mb-2">Time: {new Date(order.time).toLocaleString()}</p>
                            <div>
                                {order.cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center mb-2">
                                        <span>{item.item.name} ({item.size})</span>
                                        <span>${item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </MainLayout>
    );
}

export default OrderHistoryPage;
