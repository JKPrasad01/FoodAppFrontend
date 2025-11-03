// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  if (roles && !roles.some((r) => hasRole(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};