import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import Loader from "./components/Loader.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Lazy imports for pages
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Currencies = lazy(() => import("./pages/Currencies.jsx"));
const ExchangeRates = lazy(() => import("./pages/ExchangeRates.jsx"));
const AddCurrency = lazy(() => import("./pages/AddCurrency.jsx"));
const EditCurrency = lazy(() => import("./pages/EditCurrency.jsx"));
const AddExchangeRate = lazy(() => import("./pages/AddExchangeRate.jsx"));
const EditExchangeRate = lazy(() => import("./pages/EditExchangeRate.jsx"));
const Convert = lazy(() => import("./pages/Convert.jsx"));

// Helper component to wrap protected routes
const Protected = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

function App() {
  const protectedRoutes = [
    { path: "/home", element: <Home /> },
    { path: "/currencies", element: <Currencies /> },
    { path: "/exchange-rates", element: <ExchangeRates /> },
    { path: "/add-currency", element: <AddCurrency /> },
    { path: "/edit-currency/:id", element: <EditCurrency /> },
    { path: "/add-exchange-rates", element: <AddExchangeRate /> },
    { path: "/edit-exchange-rate/:id", element: <EditExchangeRate /> },
    { path: "/convert", element: <Convert /> },
  ];

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<Protected>{element}</Protected>}
            />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
