// Dossier : src/hooks, Fichier : useAuth.ts
// Ce hook personnalisé permet d'accéder au contexte d'authentification (AuthContext)
// et garantit que le hook est utilisé dans un AuthProvider.

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  authToken: AuthToken | null;
  isAuthenticated: boolean;
  login: (token: string, expiresIn: number) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface AuthToken {
  token: string;
  expires: number;
}

/**
 * Hook personnalisé pour accéder au contexte d'authentification.
 * Doit être utilisé dans un AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
