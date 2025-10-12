import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProtectedRoute from "./components/ProtectedRoute";
import Currencies from "./pages/Currencies";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route 
        path="/currencies"
        element={<ProtectedRoute>
              <Currencies />
        </ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
