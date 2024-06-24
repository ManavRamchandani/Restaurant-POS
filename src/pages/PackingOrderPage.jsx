import React, { useState, useId } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewOrder, moveToPreparing, moveToPacked, moveToOrderHistory } from "../redux/ordersSlice";

function PackingOrdersPage() {
  const [currentSection, setCurrentSection] = useState("New");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const newOrders = useSelector((state) => state.orders.newOrders);
  const preparingOrders = useSelector((state) => state.orders.preparingOrders);
  const packedOrders = useSelector((state) => state.orders.packedOrders);
  const orderHistory = useSelector((state) => state.orders.orderHistory);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useId();

  const handleSectionClick = (section) => {
    setCurrentSection(section);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const newOrder = {
      id: id, // Ensure unique ID
      customerName,
      phoneNumber,
      status: "New",
      cartItems: [],
      totalAmount: 0,
    };
    // dispatch(addNewOrder(newOrder));
    navigate(`/packing-pos/${newOrder.id}`, { state: { customerName, phoneNumber, id: newOrder.id } });
  };

  const renderOrders = (orders, moveToNextStage) => {
    return orders.map((order) => (
      <div key={order.id}  className="p-6  bg-white rounded-lg shadow-md">
        <div className="flex gap-32" >
        <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order #{order.id}</h2>
        <p className="text-gray-700">Customer: {order.customerName}</p>
        <p className="text-gray-700">Phone: {order.phoneNumber}</p>
        <p className="text-gray-700">Status: {order.status}</p>
        <p className="text-gray-700">Total Amount: {order.totalAmount}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Items:</h3>
          <ul className="list-disc list-inside">
            {order.cartItems.map((item, index) => (
              <li key={`${order.id}-${index}`} className="text-gray-700">
                {item.name} - {item.size} - {item.quantity} - {item.totalAmount}
              </li>
            ))}
          </ul>
        </div>
        </div>
        {moveToNextStage && (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" 
            onClick={() => dispatch(moveToNextStage(order.id))}
          >
            Move to{" "}
            {currentSection === "New" ? "Packing" : currentSection === "Packing" ? "Packed" : "Order History"}
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Orders</h1>
      <nav className="mb-8 flex justify-center">
        {["New", "Packing", "Packed", "Order History"].map((section) => (
          <button
            key={section}
            className={`mx-2 px-4 py-2 rounded-md ${currentSection === section ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => handleSectionClick(section)}
          >
            {section}
          </button>
        ))}
      </nav>

      {currentSection === "New" && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Place New Order</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="customerName">Customer Name</label>
              <input
                type="text"
                id="customerName"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Place Order</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{currentSection} Orders</h2>
        {currentSection === "New" && renderOrders(newOrders, moveToPreparing)}
        {currentSection === "Packing" && renderOrders(preparingOrders, moveToPacked)}
        {currentSection === "Packed" && renderOrders(packedOrders, moveToOrderHistory)}
        {currentSection === "Order History" && renderOrders(orderHistory)}
      </div>
    </div>
  );
}

export default PackingOrdersPage;
