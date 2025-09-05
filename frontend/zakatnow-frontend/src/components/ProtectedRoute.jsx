// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const authData = JSON.parse(localStorage.getItem("auth") || "{}");

  // Jika belum login
  if (!authData?.token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada requiredRole dan user tidak punya role itu
  if (requiredRole && !authData.roles?.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
