
import React from 'react'
import { Link } from 'react-router-dom'
import POSPage from './POSPage'
import MainLayout from '../layouts/MainLayout'
import FloorPlan from '../components/FloorPlan'

function HomePage() {
  return (
    <MainLayout>
                    {/* <div className='bg-slate-100 p-10 rounded-md pl-36'>
                <h1 className='font-semibold text-2xl mb-1'>Welcome to the 1st Sample of MahadevPos</h1>
                <p className='font-light text-xs'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam quibusdam vel repellat!</p>
                <p className='font-light text-xs mb-3 mt-3'>if you have an issue, call 7568-024-789 anytime</p>
                <Link to='/pos' className='text-white bg-blue-500 rounded-md p-2 text-xs font-extralight'>click here to sell Product</Link>
            </div> */}

<div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <FloorPlan />
    </div>

    </MainLayout>
 )
}

export default HomePage