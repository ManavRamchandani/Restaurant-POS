import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addProductToCart,
  removeProduct,
  increaseQuantity,
  decreaseQuantity,
  clearTableCart,
  selectCart,
  selectTotalAmount,
} from "../redux/cartSlice";
import { clearTable } from "../redux/tableSlice";

function CategoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const table = location.state?.table;
  const dispatch = useDispatch();
  const cart = useSelector((state) => selectCart(state, table?.id));
  const totalAmount = useSelector((state) =>
    selectTotalAmount(state, table?.id)
  );
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false); // State for confirmation popup
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const result = await axios.get("http://localhost:3000/category");
    setCategories(await result.data);
    setIsLoading(false);
  };

  const handleAddProductToCart = (item, size) => {
    const price = size === "half" ? item.half_price : item.full_price;
    dispatch(addProductToCart({ tableId: table.id, item, size, price }));
    setShowPopup(false);
  };

  const handleClearTable = () => {
    setConfirmClear(true);
  };

  const confirmClearTable = () => {
    if (!customerName.trim()) {
      toast.error('Name is required', toastOptions);
      return;
    }

    // Save order to order history
    const order = {
      tableId: table.id,
      tableName: table.name,
      customerName,
      customerPhone,
      cart,
      totalAmount,
      date: new Date().toISOString(),
    };
    // For simplicity, we're using localStorage to store order history
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orderHistory.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    dispatch(clearTableCart({ tableId: table.id }));
    dispatch(clearTable({ tableId: table.id }));
    setConfirmClear(false);
    navigate("/");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleCategory = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  return (
    <MainLayout>
      {isLoading ? (
        "loading"
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {/* Left column for Categories */}
          <div className="col-span-1">
            {/* Categories */}
            <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-start">
              <div className="max-w-screen-lg bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
                  Categories
                </h1>
                {Object.keys(categories).map((categoryName, index) => (
                  <div key={index} className="mb-6">
                    <h2
                      className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 cursor-pointer"
                      onClick={() => toggleCategory(categoryName)}
                    >
                      {categoryName}
                    </h2>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle column for Menu Items */}
          <div className="col-span-1">
            {/* Menu Items */}
            <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-start">
              <div className="max-w-screen-lg bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
                  Menu Items
                </h1>
                {Object.keys(categories).map((categoryName, index) => (
                  <div key={index}>
                    {openCategory === categoryName && (
                      <ul className="space-y-2">
                        {categories[categoryName].map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            onClick={() => handleItemClick(item)}
                            className="flex justify-between items-center bg-gray-50 p-3 gap-7 rounded-md shadow-sm cursor-pointer"
                          >
                            <span className="text-gray-700">{item.name}</span>
                            <span className="text-gray-500">
                              Half: {item.half_price}
                            </span>
                            <span className="text-gray-500">
                              Full: {item.full_price}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column for Cart */}
          <div className="col-span-1 w-30">
            {/* Cart */}
            <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-start">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Table: {table?.name}
                </h2>
                {/* Cart Table */}
                <table className="table-auto w-full text-left border-collapse">
                  {/* Table Headers */}
                  <thead>
                    <tr className="bg-gray-800 text-gray-300">
                      <th className="p-2 border border-gray-700">#</th>
                      <th className="p-2 border border-gray-700">Name</th>
                      <th className="p-2 border border-gray-700">Size</th>
                      <th className="p-2 border border-gray-700">Price</th>
                      <th className="p-2 border border-gray-700">Qty</th>
                      <th className="p-2 border border-gray-700">Total</th>
                      <th className="p-2 border border-gray-700">Action</th>
                    </tr>
                  </thead>
                  {/* Table Body */}
                  <tbody>
                    {cart && cart.length > 0 ? (
                      cart.map((cartProduct, key) => (
                        <tr key={key} className="bg-gray-900 text-gray-300">
                          <td className="p-2 border border-gray-700">
                            {key + 1}
                          </td>
                          <td className="p-2 border border-gray-700">
                            {cartProduct.name}
                          </td>
                          <td className="p-2 border border-gray-700">
                            {cartProduct.size}
                          </td>
                          <td className="p-2 border border-gray-700">
                            {cartProduct.price}
                          </td>
                          <td className="p-2 border border-gray-700">
                            <div className="flex items-center gap-2">
                              <button
                                className="px-2 py-1 bg-gray-700 text-white rounded-md"
                                onClick={() =>
                                  dispatch(
                                    decreaseQuantity({
                                      tableId: table.id,
                                      id: cartProduct.id,
                                      size: cartProduct.size,
                                    })
                                  )
                                }
                              >
                                -
                              </button>
                              <span>{cartProduct.quantity}</span>
                              <button
                                className="px-2 py-1 bg-gray-700 text-white rounded-md"
                                onClick={() =>
                                  dispatch(
                                    increaseQuantity({
                                      tableId: table.id,
                                      id: cartProduct.id,
                                      size: cartProduct.size,
                                    })
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-2 border border-gray-700">
                            {cartProduct.totalAmount}
                          </td>
                          <td className="p-2 border border-gray-700">
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded-md"
                              onClick={() =>
                                dispatch(
                                  removeProduct({
                                    tableId: table.id,
                                    id: cartProduct.id,
                                    size: cartProduct.size,
                                  })
                                )
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="p-4 text-center text-gray-500"
                        >
                          No Item in Cart
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Total Amount */}
                <div className="mt-4 text-right">
                  <h3 className="text-xl font-bold text-gray-700">
                    Total: {totalAmount}
                  </h3>
                </div>

                {/* Pay Now and Clear Table Buttons */}
                <div className="mt-4 text-right">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-md">
                    Pay Now
                  </button>
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="py-2 px-4 bg-red-600 text-white rounded-md"
                  >
                    Clear Table
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Pop-up for Clear Table */}
      {confirmClear && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Confirm Clear Table</h2>
            <p className="mb-4">Please enter the customer's name and mobile number:</p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
                Name (required)
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerPhone">
                Mobile Number (optional)
              </label>
              <input
                type="text"
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md mr-2"
                onClick={confirmClearTable}
              >
                Yes, Clear Table
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => setConfirmClear(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
    </MainLayout>
  );
}

export default CategoryPage;
