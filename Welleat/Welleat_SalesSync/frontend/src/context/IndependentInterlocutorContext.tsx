//// Dossier : src/context, Fichier : IndependentInterlocutorContext.tsx
// Ce contexte gère les interlocuteurs indépendants (ceux qui ne sont pas associés à une entreprise).
// Il fournit une fonction pour ajouter un nouvel interlocuteur au contexte.

import React, { createContext, useState, ReactNode } from 'react';

export interface IndependentInterlocutor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  comment?: string;
}

interface IndependentInterlocutorContextProps {
  interlocutors: IndependentInterlocutor[]; // Liste des interlocuteurs indépendants
  addInterlocutor: (interlocutor: IndependentInterlocutor) => void; // Fonction pour ajouter un interlocuteur
}

export const IndependentInterlocutorContext = createContext<IndependentInterlocutorContextProps>({
  interlocutors: [],
  addInterlocutor: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

/**
 * Provider pour le contexte des interlocuteurs indépendants.
 * Permet d'ajouter de nouveaux interlocuteurs qui ne sont pas associés à une entreprise.
 */
export const IndependentInterlocutorProvider: React.FC<ProviderProps> = ({ children }) => {
  const [interlocutors, setInterlocutors] = useState<IndependentInterlocutor[]>([]);

  const addInterlocutor = (interlocutor: IndependentInterlocutor) => {
    setInterlocutors(prev => [...prev, interlocutor]);
    console.log('Interlocuteur ajouté au contexte:', interlocutor);
  };

  return (
    <IndependentInterlocutorContext.Provider value={{ interlocutors, addInterlocutor }}>
      {children}
    </IndependentInterlocutorContext.Provider>
  );
};
