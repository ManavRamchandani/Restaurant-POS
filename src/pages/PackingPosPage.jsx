import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToPackingCart,
  removeProductFromPackingCart,
  increasePackingCartQuantity,
  decreasePackingCartQuantity,
  selectPackingCart,
  selectPackingCartTotalAmount, // Correct import name
  clearPackingCart,
} from "../redux/PackingCartSlice";

function PackingPosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cart = useSelector(selectPackingCart);
  const totalAmount = useSelector(selectPackingCartTotalAmount); // Correct usage
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const customerName = location.state?.customerName;
  const customerPhone = location.state?.customerPhone;

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("http://localhost:3000/category");
      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProductToCart = (item, size) => {
    const price = size === "half" ? item.half_price : item.full_price;
    dispatch(addProductToPackingCart({ item, size, price }));
    setShowPopup(false);
  };

  const handlePlaceOrder = () => {
    const order = {
      customerName,
      customerPhone,
      cart,
      totalAmount,
      date: new Date().toISOString(),
    };
    // Save order to order history (localStorage or API)
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orderHistory.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    dispatch(clearPackingCart());
    navigate('/packing-order');
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
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <div className="p-4 bg-gray-100 min-h-screen">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Categories</h1>
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

          <div className="col-span-1">
            <div className="p-4 bg-gray-100 min-h-screen">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Menu Items</h1>
                {Object.keys(categories).map((categoryName, index) => (
                  <div key={index}>
                    {openCategory === categoryName && (
                      <ul className="space-y-2">
                        {categories[categoryName].map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            onClick={() => handleItemClick(item)}
                            className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm cursor-pointer"
                          >
                            <span className="text-gray-700">{item.name}</span>
                            <span className="text-gray-500">Half: {item.half_price}</span>
                            <span className="text-gray-500">Full: {item.full_price}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1 w-30">
            <div className="p-4 bg-gray-100 min-h-screen">
              <div>
                <h2 className="text-2xl font-bold mb-4">Packing Cart</h2>
                <table className="table-auto w-full text-left border-collapse">
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
                  <tbody>
                    {cart && cart.length > 0 ? (
                      cart.map((cartProduct, key) => (
                        <tr key={key} className="bg-gray-900 text-gray-300">
                          <td className="p-2 border border-gray-700">{key + 1}</td>
                          <td className="p-2 border border-gray-700">{cartProduct.name}</td>
                          <td className="p-2 border border-gray-700">{cartProduct.size}</td>
                          <td className="p-2 border border-gray-700">{cartProduct.price}</td>
                          <td className="p-2 border border-gray-700">
                            <div className="flex items-center gap-2">
                              <button
                                className="px-2 py-1 bg-gray-700 text-white rounded-md"
                                onClick={() =>
                                  dispatch(
                                    decreasePackingCartQuantity({
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
                                    increasePackingCartQuantity({
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
                          <td className="p-2 border border-gray-700">{cartProduct.totalAmount}</td>
                          <td className="p-2 border border-gray-700">
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded-md"
                              onClick={() =>
                                dispatch(
                                  removeProductFromPackingCart({
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
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          No Item in Cart
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="mt-4 text-right">
                  <h3 className="text-xl font-bold text-gray-700">Total: {totalAmount}</h3>
                </div>

                <div className="mt-4 text-right">
                  <button onClick={handlePlaceOrder} className="px-4 py-2 bg-green-500 text-white rounded-md">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
  );
}

export default PackingPosPage;
