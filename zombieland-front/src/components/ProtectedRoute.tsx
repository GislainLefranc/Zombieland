
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../Auth/authContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  console.log("ProtectedRoute rendu");
  const { user, isLoading } = useAuth();
  const {userId} = useParams(); // Retrieve user ID from the URL
  console.log("userId dans protectedRoute",userId)
  const parsedUserId = Number(userId);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole !== undefined && user.role_id !== requiredRole && user.id !== parsedUserId) {
    console.log("Access denied. Redirecting to /403...");
    console.log("user.role_id:", user.role_id);
    console.log("requiredRole:", requiredRole);
    console.log("user.id:", user.id);
    console.log("parsedUserId:", parsedUserId);
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
