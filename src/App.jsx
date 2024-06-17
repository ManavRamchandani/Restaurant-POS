import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import POSPage from './pages/POSPage'
import CategoryPage from './pages/CategoryPage.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/cat' element={<POSPage />} />
        <Route path='/pos' element={<CategoryPage />} />
      </Routes>
    </Router>
  )
}

export default App
