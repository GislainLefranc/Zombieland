// Dossier : src/Pages/LogoutPage | Fichier : LogoutPage.tsx
// Ce composant déconnecte l'utilisateur et redirige vers la page d'accueil.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  return null;
};

export default LogoutPage;
