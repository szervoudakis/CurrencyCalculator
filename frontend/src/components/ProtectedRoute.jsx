import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
// This component ensures that only authenticated users
// can access certain routes in your app.
export default function ProtectedRoute({ children }) {
  // Access the authentication context to get the token and loading state
  const { token , loading } = useContext(AuthContext);
  // 1. While the app is still checking authentication (e.g., restoring token from localStorage)
  // show a loader instead of redirecting or rendering the protected page.
  if (loading) {
    return <Loader/>;
  }
  //If there's no valid JWT token (user not logged in),
  // redirect them back to the login page.
  if (!token) {
    return <Navigate to="/" replace />;
  }
  //allow access to protected page
  return children;
}
