//// Dossier : src/context, Fichier : UserContext.tsx
// Ce contexte gère les données de l'utilisateur connecté.
// Il récupère les informations de l'utilisateur via l'API et fournit des états pour l'utilisateur, le chargement et les erreurs.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../api/axiosInstance';
import { User } from '../types/index';
import { toast } from 'react-toastify';

interface UserContextProps {
  user: User | null;      // Données de l'utilisateur
  loading: boolean;       // Indique si le chargement est en cours
  error: string | null;   // Message d'erreur éventuel
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true,
  error: null,
});

/**
 * Hook pour accéder au contexte utilisateur.
 */
export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

/**
 * Provider pour le contexte utilisateur.
 * Récupère les données de l'utilisateur connecté depuis l'API.
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Appel API pour récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<User>('/auth/me');
        setUser(response.data);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || "Erreur lors du chargement de l'utilisateur";
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
