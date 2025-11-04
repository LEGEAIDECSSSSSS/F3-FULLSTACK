// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Automatically detect API base URL
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Log the current user whenever it changes (safe)
  useEffect(() => {
    console.log("👤 Current user:", user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Backend login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login failed:", data.message);
        return { success: false, message: data.message || "Login failed" };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      console.log("User logged in:", data.user);

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout request failed:", err);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    console.log("User logged out");
  };

  // Signup
  const signup = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Signup failed:", data.message);
        return { success: false, message: data.message || "Signup failed" };
      }

      console.log("Signup successful:", data);
      return { success: true, message: "Signup successful" };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context safely
export const useAuth = () => useContext(AuthContext);
