// Dossier : src/hooks, Fichier : useCompanyInterlocutors.ts
// Ce hook gère la liste des interlocuteurs d'une entreprise en permettant d'ajouter,
// de supprimer et de définir un interlocuteur comme principal. Il utilise uuid pour générer une clé unique.

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Interlocutor as GlobalInterlocutor } from '../types/index';

interface Interlocutor extends Omit<GlobalInterlocutor, 'id'> {
  id?: number;
  uniqueKey: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  interlocutorType: 'client potentiel' | 'client' | 'ambassadeur';
  comment?: string;
  isPrincipal: boolean;
  isIndependent: boolean;
  companyId?: number | null;
  userId?: number | null;
}

/**
 * Hook pour gérer la liste des interlocuteurs d'une entreprise.
 */
export const useCompanyInterlocutors = (
  initialInterlocutors: Interlocutor[] = []
) => {
  const [interlocutors, setInterlocutors] = useState<Interlocutor[]>(initialInterlocutors);
  // Utilisation d'un Set pour suivre les emails déjà traités et éviter les doublons
  const processedEmails = new Set<string>();

  /**
   * Ajoute un interlocuteur s'il n'a pas déjà été traité (vérification par email).
   * @param newInterlocutor - Nouvel interlocuteur à ajouter.
   */
  const addInterlocutor = useCallback((newInterlocutor: Interlocutor) => {
    if (processedEmails.has(newInterlocutor.email)) {
      return;
    }

    setInterlocutors(prev => {
      const exists = prev.some(i => i.email === newInterlocutor.email);
      if (exists) return prev;

      processedEmails.add(newInterlocutor.email);
      return [
        ...prev,
        {
          ...newInterlocutor,
          uniqueKey: uuidv4(),
          isPrincipal: newInterlocutor.isPrincipal ?? false,
          isIndependent: newInterlocutor.isIndependent ?? false,
          interlocutorType:
            newInterlocutor.interlocutorType || 'client potentiel',
        },
      ];
    });
  }, []);

  /**
   * Supprime un interlocuteur en fonction de sa clé unique.
   * @param uniqueKey - Clé unique de l'interlocuteur à supprimer.
   */
  const removeInterlocutor = useCallback((uniqueKey: string) => {
    setInterlocutors(prev => {
      const interlocutor = prev.find(i => i.uniqueKey === uniqueKey);
      if (interlocutor) {
        processedEmails.delete(interlocutor.email);
      }
      return prev.filter(i => i.uniqueKey !== uniqueKey);
    });
  }, []);

  /**
   * Définit l'interlocuteur principal en mettant à jour l'état pour que
   * seul l'interlocuteur correspondant à la clé unique soit marqué principal.
   * @param uniqueKey - Clé unique de l'interlocuteur principal.
   */
  const setPrincipal = useCallback((uniqueKey: string) => {
    setInterlocutors(current =>
      current.map(interlocutor => ({
        ...interlocutor,
        isPrincipal: interlocutor.uniqueKey === uniqueKey,
      }))
    );
  }, []);

  return {
    interlocutors,
    addInterlocutor,
    removeInterlocutor,
    setPrincipal,
    clearProcessedEmails: () => processedEmails.clear(),
  };
};
