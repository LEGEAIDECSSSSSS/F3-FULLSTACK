// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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

  // ===== Axios instance with interceptors =====
  const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  });

  api.interceptors.request.use(async (config) => {
    let token = accessToken;

    // Attach token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Attempt to refresh token
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  // ===== Login =====
const login = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok)
      return { success: false, message: data.message || "Login failed" };

    // Update user and token in context
    setUser({ ...data.user, role: data.user.role });
    setAccessToken(data.accessToken);

    // ⭐ return user so Login.jsx can see the role IMMEDIATELY
    return { success: true, user: data.user };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Something went wrong" };
  }
};


  // ===== Logout =====
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout request failed:", err);
    }

    setUser(null);
    setAccessToken(null);
  };

  // ===== Signup =====
  const signup = async (username, email, password, role) => {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Signup failed" };

    return { success: true, message: "Signup successful" };
  } catch (err) {
    console.error("Signup error:", err);
    return { success: false, message: "Something went wrong" };
  }
};


  // ===== Refresh access token =====
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
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

  // ===== Helper to use axios with auto-refresh =====
  const authApi = api;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        signup,
        refreshAccessToken,
        authApi,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
