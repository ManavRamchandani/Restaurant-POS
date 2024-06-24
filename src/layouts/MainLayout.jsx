import React from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function MainLayout({ children }) {
  return (
    <div>
      <header>
        <nav className='p-3 w-full bg-blue-500 flex justify-between'>
          <Link to='/' className='text-white'>MahadevPos</Link>
          <div>
          <Link to='/packing-order' className='text-white mr-4'>Packing</Link>
            <Link to='/order-history' className='text-white underline mr-4'>Order History</Link>
            <Link to='/day-summary' className='text-white underline'>Day Summary</Link>
          </div>
        </nav>
      </header>
      <main className=''>
        {children}
      </main>
      <ToastContainer />
    </div>
  )
}

export default MainLayout
