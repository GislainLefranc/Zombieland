//// Dossier : src/context, Fichier : AuthContext.tsx
// Ce contexte gère l'authentification de l'utilisateur (connexion, déconnexion, récupération du token et des données utilisateur).

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
// Importation des interfaces User et Role depuis vos types (à adapter selon votre projet)
import type { User, Role } from '../types';

interface AuthToken {
  token: string;
  expires: number;
}

interface AuthContextProps {
  user: User | null;                        // Données de l'utilisateur connecté
  setUser: (user: User | null) => void;       // Fonction pour mettre à jour l'utilisateur
  authToken: AuthToken | null;              // Objet contenant le token et sa date d'expiration
  isAuthenticated: boolean;                 // Indique si l'utilisateur est authentifié
  login: (token: string, expiresIn: number) => Promise<void>; // Fonction de connexion
  logout: () => void;                       // Fonction de déconnexion
  loading: boolean;                         // Indique si la vérification est en cours
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  authToken: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Vérifie si le token est présent et valide
  const isAuthenticated = !!authToken && authToken.expires > Date.now();

  // Lors du montage, récupère le token depuis localStorage et, si valide, charge les données utilisateur
  useEffect(() => {
    console.log('🔍 Vérification du token au démarrage');
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const parsedToken: AuthToken = JSON.parse(token);
        if (parsedToken.expires > Date.now()) {
          console.log('✅ Token valide trouvé:', parsedToken);
          setAuthToken(parsedToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${parsedToken.token}`;
          fetchUserData();
        } else {
          console.log('❌ Token expiré, déconnexion');
          logout();
        }
      } catch (e) {
        console.error('❌ Erreur lors du parsing du token:', e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Récupère les données utilisateur depuis l'API
  const fetchUserData = async () => {
    try {
      console.log('🔄 Récupération des données utilisateur');
      const response = await axiosInstance.get('/users/me');
      console.log('👤 Données utilisateur reçues:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données utilisateur:', error);
      logout();
    }
  };

  // Fonction de connexion : stocke le token, configure axios et récupère les données utilisateur
  const login = async (token: string, expiresIn: number) => {
    try {
      console.log('🔑 Début du processus de connexion');
      const tokenData: AuthToken = {
        token,
        expires: Date.now() + expiresIn * 1000,
      };

      setAuthToken(tokenData);
      localStorage.setItem('authToken', JSON.stringify(tokenData));
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Token configuré:', token);

      await new Promise(resolve => setTimeout(resolve, 100));

      await fetchUserData();
      navigate('/homepage');
    } catch (error) {
      console.error('❌ Erreur login:', error);
      logout();
    }
  };

  // Déconnexion : réinitialise le token et les données utilisateur, supprime le token de localStorage et redirige
  const logout = () => {
    console.log('🔓 Déconnexion utilisateur');
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authToken,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook pour accéder au contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
