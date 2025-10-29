import { useState } from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router'
import HomePage from "./pages/HomePage"
import NavBar from './components/NavBar'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import AuthProvider from './Context/AuthProvider'
import CartPage from './pages/CartPage'
import ProtectedRoute from './components/ProtectedRoute'
import CartProvider from './Context/CartProvider'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

function App() {
  


  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route element={<ProtectedRoute/>}>
          <Route path='/cart' element={<CartPage/>}/>
          <Route path='/checkout' element={<CheckoutPage/>}/>
          <Route path='/orderSuccess' element={<OrderSuccessPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
