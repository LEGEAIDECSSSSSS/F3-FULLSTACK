import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // if no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // otherwise, show the protected page
  return children;
}
