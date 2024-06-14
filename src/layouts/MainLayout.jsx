import React from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer,  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainLayout({children}) {
  return (
<div>
        <header>
        <nav className='p-3 w-full bg-blue-500'>
            <Link to='/' className='text-white'>MahadevPos</Link>
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