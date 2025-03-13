// Dossier : src/hooks, Fichier : useDeleteItems.ts
// Ce hook permet de supprimer des éléments via l'API.
// Il gère l'état de la suppression, les erreurs et affiche des notifications.

import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

interface DeleteItemsResult {
  deleteItems: (items: number[], type: string) => Promise<boolean>;
  isDeleting: boolean;
  error: string | null;
}

/**
 * Hook personnalisé pour supprimer des éléments via l'API.
 */
export const useDeleteItems = (): DeleteItemsResult => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Supprime les éléments spécifiés en fonction de leur type.
   * @param items - Tableau d'IDs à supprimer.
   * @param type - Type d'éléments (utilisé pour construire l'endpoint de l'API).
   * @returns true si la suppression a réussi, false sinon.
   */
  const deleteItems = async (
    items: number[],
    type: string
  ): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      await Promise.all(
        items.map(id => axiosInstance.delete(`/${type}/${id}`))
      );
      toast.success('Éléments supprimés avec succès');
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erreur lors de la suppression';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteItems, isDeleting, error };
};
