import { useState } from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router'
import HomePage from "./pages/HomePage"

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App
