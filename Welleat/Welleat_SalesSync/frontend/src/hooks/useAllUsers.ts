// Dossier : src/hooks, Fichier : useAllUsers.ts
// Ce hook personnalisé permet de récupérer tous les utilisateurs depuis l’API,
// de gérer l’état du chargement et des erreurs, ainsi que de filtrer les utilisateurs selon un terme de recherche.

import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Hook personnalisé pour récupérer tous les utilisateurs.
 */
const useAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère les utilisateurs depuis l’API.
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filtre les utilisateurs en fonction d’un terme de recherche.
   * @param searchTerm - Terme de recherche.
   */
  const filterUsers = useCallback(
    (searchTerm: string) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = users.filter(
        user =>
          user.firstName.toLowerCase().includes(lowerSearchTerm) ||
          user.lastName.toLowerCase().includes(lowerSearchTerm) ||
          user.email.toLowerCase().includes(lowerSearchTerm)
      );
      setUsers(filtered);
    },
    [users]
  );

  return {
    users,
    loading,
    error,
    fetchUsers,
    filterUsers,
  };
};

export default useAllUsers;
