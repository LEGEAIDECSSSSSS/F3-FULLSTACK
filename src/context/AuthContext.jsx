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
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  // Sync user and access token to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [user, accessToken]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || "Login failed" };

      setUser(data.user);
      setAccessToken(data.accessToken);

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include", // send cookie to clear refresh token
      });
    } catch (err) {
      console.warn("Logout request failed:", err);
    }

    setUser(null);
    setAccessToken(null);
  };

  // Signup function
  const signup = async (username, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || "Signup failed" };

      return { success: true, message: "Signup successful" };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include", // send refresh cookie
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to refresh token");

      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (err) {
      console.error("Refresh token error:", err);
      logout();
      return null;
    }
  };

  // Helper to make API calls with auto-refresh
  const authFetch = async (url, options = {}) => {
    // Add Authorization header
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    options.credentials = "include";

    let res = await fetch(url, options);
    if (res.status === 401) {
      // Token expired, try refresh
      const newToken = await refreshAccessToken();
      if (!newToken) return res;

      options.headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(url, options);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, signup, refreshAccessToken, authFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
