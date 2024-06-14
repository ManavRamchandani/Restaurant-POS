// src/pages/CategoryPage.js
import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addProductToCart, removeProduct, increaseQuantity, decreaseQuantity, selectCart, selectTotalAmount } from '../redux/cartSlice';

function CategoryPage() {
  const location = useLocation();
  const table = location.state?.table;
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const totalAmount = useSelector(selectTotalAmount);
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const result = await axios.get('http://localhost:3000/category');
    setCategories(await result.data);
    setIsLoading(false);
  };

  const handleAddProductToCart = (item, size) => {
    const price = size === 'half' ? item.half_price : item.full_price;
    dispatch(addProductToCart({ item, size, price }));
    setShowPopup(false);
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
        'loading'
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
                <h2 className="text-2xl font-bold mb-4">Table: {table?.name}</h2>
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
                    {/* Render cart items */}
                    {cart && cart.length > 0 ? (
                      cart.map((cartProduct, key) => (
                        <tr key={key} className="bg-gray-900 text-gray-300">
                          <td className="p-2 border border-gray-700">
                            {cartProduct.id}
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
                          <td className="p-2 border border-gray-700 flex items-center gap-2">
                            <button
                              className="px-2 py-1 bg-gray-700 text-white rounded-md"
                              onClick={() => dispatch(decreaseQuantity({ id: cartProduct.id, size: cartProduct.size }))}
                            >
                              -
                            </button>
                            {cartProduct.quantity}
                            <button
                              className="px-2 py-1 bg-gray-700 text-white rounded-md"
                              onClick={() => dispatch(increaseQuantity({ id: cartProduct.id, size: cartProduct.size }))}
                            >
                              +
                            </button>
                          </td>
                          <td className="p-2 border border-gray-700">
                            {cartProduct.totalAmount}
                          </td>
                          <td className="p-2 border border-gray-700">
                            <button
                              className="px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                              onClick={() => dispatch(removeProduct({ id: cartProduct.id, size: cartProduct.size }))}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          No Item in Cart
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Total Amount */}
                <h1 className="mt-4 text-2xl font-bold text-gray-800">
                  Total Amount: Rs. {totalAmount}
                </h1>
                <div className="mt-3">
                  {/* Render payment button */}
                  {totalAmount !== 0 ? (
                    <div>
                      <button className="py-2 px-5 rounded-md border border-gray-700 bg-blue-600 text-white font-semibold">
                        Pay Now
                      </button>
                    </div>
                  ) : (
                    'Please add Item to Cart'
                  )}
                </div>
              </div>
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
                onClick={() => handleAddProductToCart(selectedItem, 'half')}
              >
                Half - Rs. {selectedItem.half_price || 'N/A'}
              </button>
              <button
                className="py-2 px-4 bg-green-600 text-white rounded-md"
                onClick={() => handleAddProductToCart(selectedItem, 'full')}
              >
                Full - Rs. {selectedItem.full_price || 'N/A'}
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
