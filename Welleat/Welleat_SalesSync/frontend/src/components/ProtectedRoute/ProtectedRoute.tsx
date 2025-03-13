//// Dossier : src/components, Fichier : ProtectedRoute.tsx
// Ce composant protège les routes en fonction des rôles autorisés.
// Il redirige l'utilisateur vers la page d'accueil si non authentifié, ou vers une page d'erreur 403 si son rôle n'est pas autorisé.

import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: number[]; // Liste des rôles autorisés (par exemple [1, 2])
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige vers la page d'accueil si l'utilisateur n'est pas authentifié
    if (!isAuthenticated) {
      navigate('/');
    }
    // Si des rôles spécifiques sont définis, vérifie que l'utilisateur en fait partie ; sinon redirige vers /403
    else if (
      allowedRoles &&
      user?.roleId !== undefined &&
      !allowedRoles.includes(user.roleId)
    ) {
      navigate('/403');
    }
  }, [isAuthenticated, navigate, allowedRoles, user]);

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
