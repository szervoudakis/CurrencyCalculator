import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

export default function ProtectedRoute({ children }) {
  const { token , loading } = useContext(AuthContext);
  if (loading) {
    return <Loader/>;
  }
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
