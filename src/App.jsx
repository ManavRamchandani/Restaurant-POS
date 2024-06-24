import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import POSPage from './pages/POSPage'
import CategoryPage from './pages/CategoryPage.jsx'
import OrderHistoryPage from './pages/orderHistoryPage.jsx'
import DaySummaryPage from './pages/daySummaryPage.jsx'
import PackingOrdersPage from './pages/PackingOrderPage.jsx'
import PackingPosPage from './components/PackingPosPage.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/cat' element={<POSPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path='/pos' element={<CategoryPage />} />
        <Route path="/day-summary" element={<DaySummaryPage />} />
        <Route path="/packing-order" element={<PackingOrdersPage />} />
      <Route path="/packing-pos/:id" element={<PackingPosPage />} />

      </Routes>
    </Router>
  )
}

export default App
