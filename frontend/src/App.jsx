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
import ExchangeRates from "./pages/ExchangeRates";
import AddCurrency from "./pages/AddCurrency";
import AddExchangeRate from "./pages/AddExchangeRate";

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

       <Route 
         path="/exchange-rates"
         element={<ProtectedRoute>
              <ExchangeRates />
        </ProtectedRoute>}/>

        <Route 
         path="/add-currency"
         element={<ProtectedRoute>
              <AddCurrency />
        </ProtectedRoute>}/>

        <Route 
         path="/add-exchange-rates"
         element={<ProtectedRoute>
              <AddExchangeRate />
        </ProtectedRoute>}/>


      </Routes>
    </BrowserRouter>
  );
}

export default App
