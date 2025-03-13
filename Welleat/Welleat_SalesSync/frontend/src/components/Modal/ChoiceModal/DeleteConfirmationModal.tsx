//// Dossier : src/components/Modal/ChoiceModal, Fichier : DeleteConfirmationModal.tsx

import React from 'react';
import ChoiceModal from './ChoiceModal';
import { Interlocutor } from '../../../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  onConfirm: () => void; // Fonction appelée pour confirmer la suppression
  title?: string; // Titre de la modal
  message?: string; // Message affiché dans la modal
  selectedCompanies: number[]; // Identifiants des établissements sélectionnés
  selectedInterlocutors: Interlocutor[]; // Interlocuteurs sélectionnés
  selectedUsers: number[]; // Identifiants des utilisateurs sélectionnés
  viewMode: string; // Mode d'affichage (companies, interlocutors, users)
  isDeleting: boolean; // Indique si la suppression est en cours
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message,
  selectedCompanies,
  selectedInterlocutors,
  selectedUsers,
  viewMode,
  isDeleting,
}) => {
  // Calcul du nombre d'éléments à supprimer en fonction du mode d'affichage
  const getItemsCount = () => {
    switch (viewMode) {
      case 'companies':
        return selectedCompanies.length;
      case 'interlocutors':
        return selectedInterlocutors.length;
      case 'users':
        return selectedUsers.length;
      default:
        return 0;
    }
  };

  const itemsCount = getItemsCount();
  const defaultMessage = `Voulez-vous vraiment supprimer ${itemsCount} ${
    viewMode === 'companies'
      ? 'établissement(s)'
      : viewMode === 'interlocutors'
      ? 'interlocuteur(s)'
      : 'utilisateur(s)'
  } ?`;

  return (
    <ChoiceModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message || defaultMessage}
      buttons={[
        {
          variant: 'danger',
          text: isDeleting ? 'Suppression...' : 'Supprimer',
          onClick: onConfirm,
          disabled: isDeleting,
        },
        {
          variant: 'cancel',
          text: 'Annuler',
          onClick: onClose,
        },
      ]}
    />
  );
};

export default DeleteConfirmationModal;
