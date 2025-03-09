import Register from "./Register/Register";
import React from 'react'
import Home from './Home/Home'
import Login from "./Login/Login";
import Navigation from "./Navigation/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div>
      <BrowserRouter>    
      <Navigation/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}