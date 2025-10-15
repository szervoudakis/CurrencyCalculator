import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
      try {
        setUser(savedUser ? JSON.parse(savedUser) : { username: "User" });
      } catch (e) {
        console.error("Error parsing user from storage", e);
        setUser({ username: "User" });
      }
    }

    setLoading(false);
  }, []);

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData)); 
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
