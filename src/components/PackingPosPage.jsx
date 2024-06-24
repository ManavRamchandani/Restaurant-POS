import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addProductToPackingCart,
  removeProductFromPackingCart,
  increasePackingCartQuantity,
  decreasePackingCartQuantity,
  clearPackingCart,
  selectPackingCart,
  selectPackingCartTotalAmount,
} from "../redux/PackingCartSlice";
import { updateOrder, getOrderById, addNewOrder } from "../redux/ordersSlice";

function PackingPosPage() {
  const { orderId,  } = useParams();
  const { customerName, phoneNumber, id } = useLocation().state;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(selectPackingCart);
  const totalAmount = useSelector(selectPackingCartTotalAmount);
  const order = useSelector((state) => getOrderById(state, orderId));
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cashGiven, setCashGiven] = useState("");
  const [changeGiven, setChangeGiven] = useState("");

  const toastOptions = {
    autoClose: 4000,
    pauseOnHover: true,
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("http://localhost:3000/category");
      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories. Please try again later.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProductToCart = (item, size) => {
    const price = size === "half" ? item.half_price : item.full_price;
    dispatch(addProductToPackingCart({ item, size, price }));
    setShowPopup(false);
  };

  const handlePlaceOrder = (state) => {
    const updatedOrder = {
      ...order,

      id,
      customerName,
      phoneNumber,
      cartItems: cart,
      totalAmount,
      status: "Pending",
    };
    console.log(updatedOrder);
    dispatch(addNewOrder(updatedOrder));
    dispatch(clearPackingCart());
    navigate(`/packing-order`);
  };

  const handlePayNow = () => {
    const updatedOrder = {
      ...order,
      cartItems: cart,
      totalAmount,
      status: "Pending",
      paymentMethod,
      cashGiven,
      changeGiven,
    };
    dispatch(new(updatedOrder));
    dispatch(clearPackingCart());
    navigate(`/packing-order`);
  };

  const handleCashGivenChange = (e) => {
    const cash = parseFloat(e.target.value);
    const change = cash - totalAmount;
    setCashGiven(cash);
    setChangeGiven(change >= 0 ? change : "");
  };

  // useEffect(() => {
  //   if (customerName && phoneNumber) {
  //     const newOrder = {
  //       id: orderId,
  //       customerName,
  //       phoneNumber,
  //       status: "New",
  //       cartItems: [],
  //       totalAmount: 0,
  //     };
  //     dispatch(addNewOrder(newOrder));
  //     dispatch(clearPackingCart());
  //   }
  // }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Packing POS</h1>
      
      <div className="flex justify-between mb-8">
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cart</h2>
          {cart.map((item, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-700">Size: {item.size}</p>
              <p className="text-gray-700">Quantity: {item.quantity}</p>
              <p className="text-gray-700">Total: {item.totalAmount}</p>
              <div className="mt-4 flex justify-between">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => dispatch(removeProductFromPackingCart(item))}
                >
                  Remove
                </button>
                <div>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    onClick={() => dispatch(decreasePackingCartQuantity(item))}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    onClick={() => dispatch(increasePackingCartQuantity(item))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Total: {totalAmount}</h3>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => setShowPopup(true)}
            >
              Pay Now
            </button>
          </div>
        </div>

        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
          {Object.keys(categories).map((category) => (
            <div key={category} className="mb-4">
              <button
                className="w-full text-left p-4 bg-blue-100 text-blue-800 rounded-md"
                onClick={() => setOpenCategory(category)}
              >
                {category}
              </button>
              {openCategory === category && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                  {categories[category].map((item) => (
                    <div key={item.id} className="p-4 bg-gray-100 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-700">Half Price: {item.half_price}</p>
                      <p className="text-gray-700">Full Price: {item.full_price}</p>
                      <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => setSelectedItem(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add {selectedItem.name} to Cart</h2>
            <div className="mb-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-4"
                onClick={() => handleAddProductToCart(selectedItem, "half")}
              >
                Half
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                onClick={() => handleAddProductToCart(selectedItem, "full")}
              >
                Full
              </button>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => setSelectedItem(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Payment Method</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
            {paymentMethod === "cash" && (
              <div className="mb-4">
                <label className="block text-gray-700">Cash Given</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={cashGiven}
                  onChange={handleCashGivenChange}
                />
                <p className="text-gray-700 mt-2">Change to Give: {changeGiven}</p>
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
              onClick={handlePayNow}
            >
              Confirm Payment
            </button>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PackingPosPage;
