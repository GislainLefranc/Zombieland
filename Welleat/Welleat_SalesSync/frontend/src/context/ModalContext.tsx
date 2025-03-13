//// Dossier : src/context, Fichier : ModalContext.tsx
// Ce contexte gère l'ouverture et la fermeture de différentes modales dans l'application,
// comme la modal de confirmation, la modal d'interlocuteur et celle de sélection d'interlocuteurs.

import React, { createContext, useState, ReactNode } from 'react';
import { Interlocutor } from '../types/index';

interface ModalContextProps {
  isConfirmationModalOpen: boolean;
  openConfirmationModal: () => void;
  closeConfirmationModal: () => void;
  isInterlocutorModalOpen: boolean;
  openInterlocutorModal: (interlocutor: Interlocutor) => void;
  closeInterlocutorModal: () => void;
  selectedInterlocutor: Interlocutor | null;
  isInterlocutorSelectionModalOpen: boolean;
  openInterlocutorSelectionModal: () => void;
  closeInterlocutorSelectionModal: () => void;
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isInterlocutorModalOpen, setInterlocutorModalOpen] = useState(false);
  const [selectedInterlocutor, setSelectedInterlocutor] = useState<Interlocutor | null>(null);
  const [isInterlocutorSelectionModalOpen, setInterlocutorSelectionModalOpen] = useState(false);

  const openConfirmationModal = () => setConfirmationModalOpen(true);
  const closeConfirmationModal = () => setConfirmationModalOpen(false);

  const openInterlocutorModal = (interlocutor: Interlocutor) => {
    setSelectedInterlocutor(interlocutor);
    setInterlocutorModalOpen(true);
  };

  const closeInterlocutorModal = () => {
    setSelectedInterlocutor(null);
    setInterlocutorModalOpen(false);
  };

  const openInterlocutorSelectionModal = () => setInterlocutorSelectionModalOpen(true);
  const closeInterlocutorSelectionModal = () => setInterlocutorSelectionModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isConfirmationModalOpen,
        openConfirmationModal,
        closeConfirmationModal,
        isInterlocutorModalOpen,
        openInterlocutorModal,
        closeInterlocutorModal,
        selectedInterlocutor,
        isInterlocutorSelectionModalOpen,
        openInterlocutorSelectionModal,
        closeInterlocutorSelectionModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
