import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If a role is required but user.role doesn't match → redirect home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
