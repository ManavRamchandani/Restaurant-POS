import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addProductToCart, removeProduct, increaseQuantity, decreaseQuantity, selectCart, selectTotalAmount } from '../redux/cartSlice';

function POSPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { name, mobile } = location.state || {};
  const tableId = 'takeout'; // Static value for takeout orders
  const cart = useSelector((state) => selectCart(state, tableId));
  const totalAmount = useSelector((state) => selectTotalAmount(state, tableId));
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get('http://localhost:3000/products');
      setProducts(result.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setIsLoading(false);
  };

  const addProductToCartHandler = (product) => {
    dispatch(addProductToCart({ tableId, item: product, size: 'default', price: product.price }));
    toast(`Added ${product.name} to cart`, toastOptions);
  };

  const removeProductFromCartHandler = (productId) => {
    dispatch(removeProduct({ tableId, id: productId, size: 'default' }));
  };

  const increaseQuantityHandler = (productId) => {
    dispatch(increaseQuantity({ tableId, id: productId }));
  };

  const decreaseQuantityHandler = (productId) => {
    dispatch(decreaseQuantity({ tableId, id: productId }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePlaceOrder = () => {
    // Logic to place order
  };

  return (
    <MainLayout>
      {isLoading ? (
        'loading'
      ) : (
        <div className="flex gap-20">
          <div className="mt-10 ml-10 w-3/5 grid grid-cols-3 gap-10">
            {products.map((product, key) => (
              <div
                key={key}
                className="rounded-md border border-black p-4 cursor-pointer"
                onClick={() => addProductToCartHandler(product)}
              >
                <p className="mb-2">{product.name}</p>
                <img
                  className="w-40 h-30 object-cover mb-2"
                  src={product.image}
                  alt={product.name}
                />
                <p>{product.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-2 border border-gray-700">#</th>
                  <th className="p-2 border border-gray-700">Name</th>
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
                      <td className="p-2 border border-gray-700">{cartProduct.id}</td>
                      <td className="p-2 border border-gray-700">{cartProduct.name}</td>
                      <td className="p-2 border border-gray-700">{cartProduct.price}</td>
                      <td className="p-2 border border-gray-700">
                        <button
                          className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                          onClick={() => increaseQuantityHandler(cartProduct.id)}
                        >
                          +
                        </button>
                        {cartProduct.quantity}
                        <button
                          className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 ml-2"
                          onClick={() => decreaseQuantityHandler(cartProduct.id)}
                        >
                          -
                        </button>
                      </td>
                      <td className="p-2 border border-gray-700">{cartProduct.totalAmount}</td>
                      <td className="p-2 border border-gray-700">
                        <button
                          className="px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          onClick={() => removeProductFromCartHandler(cartProduct.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No Item in Cart
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              Total Amount: Rs. {totalAmount}
            </h1>
            <div className="mt-3">
              {totalAmount !== 0 ? (
                <div>
                  <button
                    className="py-2 px-5 rounded-md border border-gray-700 bg-blue-600 text-white font-semibold"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
                </div>
              ) : (
                'Please add Item to Cart'
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default POSPage;
