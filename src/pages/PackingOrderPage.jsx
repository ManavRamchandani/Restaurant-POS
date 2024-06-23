import React, { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { addProductToCart, clearTableCart, selectCart, selectTotalAmount } from '../redux/cartSlice'
import { clearTable } from '../redux/tableSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function PackingOrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [packingOrders, setPackingOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleAddProductToCart = (item, size) => {
    const price = size === "half" ? item.half_price : item.full_price;
    dispatch(addProductToCart({ tableId: 'packing', item, size, price }));
    setShowPopup(false);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const handlePlaceOrder = () => {
    if (!customerName) {
      toast.error("Customer name is required", { autoClose: 2000 });
      return;
    }

    const cart = selectCart(state => selectCart(state, 'packing'));
    const totalAmount = selectTotalAmount(state => selectTotalAmount(state, 'packing'));

    const newOrder = {
      id: Date.now(),
      customerName,
      customerPhone,
      cart,
      totalAmount,
      date: new Date()
    };

    setPackingOrders([...packingOrders, newOrder]);

    dispatch(clearTableCart({ tableId: 'packing' }));
    dispatch(clearTable({ tableId: 'packing' }));
    setCustomerName('');
    setCustomerPhone('');
    toast.success("Order placed successfully", { autoClose: 2000 });
  };

  return (
    <MainLayout>
      <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-start">
        <div className="max-w-screen-lg bg-white p-6 rounded-lg shadow-md w-full">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
            Packing Orders
          </h1>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <label className="block mb-2 text-gray-700 mt-4">Customer Phone (optional)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <button
              onClick={handlePlaceOrder}
              className="mt-4 py-2 px-4 bg-green-600 text-white rounded-md"
            >
              Place Order
            </button>
          </div>

          {/* Displaying list of packing orders */}
          <h2 className="text-2xl font-bold mb-4">Dine-out Orders</h2>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="p-2 border border-gray-700">Order ID</th>
                <th className="p-2 border border-gray-700">Customer Name</th>
                <th className="p-2 border border-gray-700">Customer Phone</th>
                <th className="p-2 border border-gray-700">Total Amount</th>
                <th className="p-2 border border-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {packingOrders.length > 0 ? (
                packingOrders.map((order, index) => (
                  <tr key={index} className="bg-gray-900 text-gray-300">
                    <td className="p-2 border border-gray-700">{order.id}</td>
                    <td className="p-2 border border-gray-700">{order.customerName}</td>
                    <td className="p-2 border border-gray-700">{order.customerPhone}</td>
                    <td className="p-2 border border-gray-700">Rs. {order.totalAmount}</td>
                    <td className="p-2 border border-gray-700">{new Date(order.date).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No Orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pop-up for choosing half or full */}
          {showPopup && selectedItem && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Choose Size</h2>
                <div className="flex gap-4">
                  <button
                    className="py-2 px-4 bg-blue-600 text-white rounded-md"
                    onClick={() => handleAddProductToCart(selectedItem, "half")}
                  >
                    Half - Rs. {selectedItem.half_price || "N/A"}
                  </button>
                  <button
                    className="py-2 px-4 bg-green-600 text-white rounded-md"
                    onClick={() => handleAddProductToCart(selectedItem, "full")}
                  >
                    Full - Rs. {selectedItem.full_price || "N/A"}
                  </button>
                </div>
                <button
                  className="mt-4 py-2 px-4 bg-red-600 text-white rounded-md"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default PackingOrdersPage
