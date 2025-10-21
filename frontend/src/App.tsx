import { useState } from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router'
import HomePage from "./pages/HomePage"
import NavBar from './components/NavBar'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import AuthProvider from './Context/AuthProvider'

function App() {
  


  return (
    <AuthProvider>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
