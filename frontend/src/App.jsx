import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { lazy, Suspense } from "react";
import './App.css'
import Loader from "./components/Loader.jsx";
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Home from './pages/Home'
import ProtectedRoute from "./components/ProtectedRoute";
// import Currencies from "./pages/Currencies";
// import ExchangeRates from "./pages/ExchangeRates";
// import AddCurrency from "./pages/AddCurrency";
// import AddExchangeRate from "./pages/AddExchangeRate";
// import EditCurrency from "./pages/EditCurrency";
// import EditExchangeRate from "./pages/EditExchangeRate";
// import Convert from "./pages/Convert";

// Lazy imports for pages
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Currencies = lazy(() => import("./pages/Currencies.jsx"));
const ExchangeRates = lazy(() => import("./pages/ExchangeRates.jsx"));
const AddCurrency = lazy(() => import("./pages/AddCurrency.jsx"));
const AddExchangeRate = lazy(() => import("./pages/AddExchangeRate.jsx"));
const EditCurrency = lazy(() => import("./pages/EditCurrency.jsx"));
const EditExchangeRate = lazy(() => import("./pages/EditExchangeRate.jsx"));
const Convert = lazy(() => import("./pages/Convert.jsx"));


function App() {
  return (
    <BrowserRouter>
      {/* Suspense will show a fallback (like a spinner) while a lazy component is loading */}
      <Suspense fallback={<Loader />}>
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
            element={
              <ProtectedRoute>
                <Currencies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exchange-rates"
            element={
              <ProtectedRoute>
                <ExchangeRates />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-currency"
            element={
              <ProtectedRoute>
                <AddCurrency />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-currency/:id"
            element={
              <ProtectedRoute>
                <EditCurrency />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-exchange-rates"
            element={
              <ProtectedRoute>
                <AddExchangeRate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-exchange-rate/:id"
            element={
              <ProtectedRoute>
                <EditExchangeRate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/convert"
            element={
              <ProtectedRoute>
                <Convert />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App
