//// Dossier : src/components, Fichier : PrivateRoute.tsx
// Ce composant protège les routes privées.
// Il vérifie si l'utilisateur est authentifié et, si non, redirige vers la page d'accueil.

import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // Affiche un message de chargement pendant la vérification de l'authentification
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Si l'utilisateur est authentifié, affiche les routes protégées ; sinon, redirige vers la page d'accueil
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
