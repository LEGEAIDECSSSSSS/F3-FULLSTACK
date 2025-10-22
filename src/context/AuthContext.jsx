import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// ✅ Automatically detect whether you're running locally or in production
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "/api";


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ✅ Backend Login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      // Store user and token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // ✅ Signup
  const signup = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "Signup failed" };
      }

      return { success: true, message: "Signup successful" };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
