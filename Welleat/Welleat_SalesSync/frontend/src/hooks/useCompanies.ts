// Dossier : src/hooks, Fichier : useCompanies.ts
// Ce hook personnalisé gère la récupération des entreprises avec une logique de retry.
// Il filtre également les entreprises en fonction du rôle de l'utilisateur.

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import { Company } from '../types';
import { useAuth } from './useAuth';

/**
 * Interface pour les options de configuration des retries.
 */
interface UseCompaniesOptions {
  maxRetries?: number;
  retryDelay?: number; // Délai en millisecondes
}

/**
 * Hook personnalisé pour gérer les entreprises avec des retries configurables.
 */
const useCompanies = (options: UseCompaniesOptions = {}) => {
  const {
    maxRetries = 3, // Nombre maximal de tentatives par défaut
    retryDelay = 1000, // Délai par défaut entre les retries (en ms)
  } = options;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  /**
   * Récupère les entreprises depuis l'API avec gestion des retries pour les erreurs 500.
   * @param retryCount - Nombre de tentatives effectuées.
   * @returns La liste des entreprises récupérées.
   */
  const fetchCompanies = useCallback(
    async (retryCount = 0): Promise<Company[]> => {
      if (!isAuthenticated || !user?.id) {
        console.warn('⚠️ Session expirée ou utilisateur non authentifié');
        setError('Veuillez vous reconnecter');
        return [];
      }

      try {
        setLoading(true);
        setError(null);

        // Choix de l'endpoint selon le rôle de l'utilisateur (administrateur ou non)
        const endpoint = user.role?.id === 1 ? '/companies' : '/companies/my-companies';

        const response = await axiosInstance.get(endpoint);

        if (!response?.data) {
          throw new Error('Données invalides reçues du serveur');
        }

        const fetchedCompanies: Company[] = response.data;
        setCompanies(fetchedCompanies);
        return fetchedCompanies;
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.error('🔒 Session expirée');
          setError('Session expirée');
          return [];
        }
        // Retry pour les erreurs 500
        if (retryCount < maxRetries && error.response?.status === 500) {
          console.warn(
            `Erreur 500 rencontrée. Retry ${retryCount + 1}/${maxRetries} dans ${retryDelay}ms...`
          );
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return fetchCompanies(retryCount + 1);
        }
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Erreur lors du chargement des entreprises';
        setError(errorMessage);
        toast.error(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [user, isAuthenticated, maxRetries, retryDelay]
  );

  /**
   * Filtre les entreprises en fonction du rôle de l'utilisateur.
   * Pour les utilisateurs non administrateurs, ne renvoie que les entreprises créées ou assignées à l'utilisateur.
   * @param data - Liste complète des entreprises.
   * @returns Liste filtrée.
   */
  const filterCompanies = useCallback(
    (data: Company[]): Company[] => {
      if (!data || !user) return [];
      if (user.role?.id === 1) return data;
      return data.filter(
        company => company.createdBy === user.id || company.assignedTo === user.id
      );
    },
    [user]
  );

  useEffect(() => {
    let mounted = true;

    if (user?.id) {
      fetchCompanies().then(data => {
        if (mounted) {
          const filtered = filterCompanies(data);
          console.log('🏢 Entreprises filtrées à afficher:', filtered);
          setCompanies(filtered);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [user, fetchCompanies, filterCompanies]);

  /**
   * Rafraîchit manuellement la liste des entreprises.
   */
  const refreshCompanies = () => {
    if (user?.id) {
      fetchCompanies();
    }
  };

  return {
    companies,
    loading,
    error,
    refreshCompanies,
    fetchCompanies,
  };
};

export default useCompanies;
