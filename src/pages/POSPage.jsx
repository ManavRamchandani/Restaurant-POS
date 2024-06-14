import React, { useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

function POSPage() {

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0)

    const toastOptions = {
      autoClose: 400,
      pauseOnHover: true,
    }

    const fetchProducts = async () => {
      setIsLoading(true);
    const result = await axios.get('http://localhost:3000/products')
    
    setProducts(await result.data);
      setIsLoading(false);
    }

    const addProductToCart = async (product) => {
      let findProductInCart = cart.find(i => {
        return i.id === product.id
      })

      if (findProductInCart) {
        let newCart = [];
        let newItem;

        cart.forEach(cartItem => {
          if (cartItem.id === product.id) {
            newItem = {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              totalAmount: cartItem.price * (cartItem.quantity + 1)
            }
            newCart.push(newItem);
          } else {
            newCart.push(cartItem)
          }

          setCart(newCart);
          toast(`Added ${newItem.name} to cart`, toastOptions)

        })

      } else {
        let addingProduct = {
          ...product,
          "quantity" : 1,
          "totalAmount" : product.price,
        }
        setCart([...cart, addingProduct]);
        toast(`Added ${product.name} to cart`, toastOptions)
      }
    }

    const removeProduct = async(product) => {
      const newCart = cart.filter(cartItem => cartItem.id !== product.id)
      setCart(newCart)
    }

    // const handlePrint = 

    

    useEffect(() => {
      fetchProducts()
    }, [])

    useEffect(() => {
      console.log(products)
    }, [products])

    useEffect(() => {
      let newTotalAmount = 0;
      cart.forEach(icart =>{
        newTotalAmount = newTotalAmount + parseInt(icart.totalAmount)
      })
      setTotalAmount(newTotalAmount)
    }, [cart])

  return (
    <MainLayout>
         
            {isLoading ? (
              "loading"
            ) : (
              <div className='flex gap-20'>
                  <div className="mt-10 ml-10 w-3/5 grid grid-cols-3 gap-10">
                  {products.map((product, key) => (  
                    <div key={key} className="rounded-md border border-black p-4" onClick={() => addProductToCart(product)}>
                      <p className="mb-2">{product.name}</p>
                      <img className="w-40 h-30 object-cover mb-2" src={product.image} alt={product.name} />
                      <p>{product.price}</p>
                    </div>
                  ))}
                </div>
                <div className='mt-10'>
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
                    {cart && cart.length > 0 ? cart.map((cartProduct, key) => (
                      <tr key={key} className="bg-gray-900 text-gray-300">
                        <td className="p-2 border border-gray-700">{cartProduct.id}</td>
                        <td className="p-2 border border-gray-700">{cartProduct.name}</td>
                        <td className="p-2 border border-gray-700">{cartProduct.price}</td>
                        <td className="p-2 border border-gray-700">{cartProduct.quantity}</td>
                        <td className="p-2 border border-gray-700">{cartProduct.totalAmount}</td>
                        <td className="p-2 border border-gray-700">
                          <button className="px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 " onClick={()=> removeProduct(cartProduct)}>Remove</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-gray-500">No Item in Cart</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <h1 className="mt-4 text-2xl font-bold text-gray-800">
                  Total Amount: Rs. {totalAmount}
                </h1>
                <div className="mt-3">
                  {totalAmount !== 0 ? <div>
                    <button className='py-2 px-5 rounded-md border border-gray-700 bg-blue-600 text-white font-semibold' >
                      Pay Now
                    </button>
                    </div> : "Please add Item to Cart"} 
                </div>
                </div>

              </div>
            )}
    </MainLayout>
  )
}

export default POSPage