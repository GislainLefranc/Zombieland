//// Dossier : src/components/Modal/ChoiceModal, Fichier : CancelAssignmentModal.tsx

import React from 'react';
import ChoiceModal from './ChoiceModal';

interface CancelAssignmentModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  title?: string; // Titre de la modal
  message?: string; // Message affiché dans la modal
}

const CancelAssignmentModal: React.FC<CancelAssignmentModalProps> = ({
  isOpen,
  onClose,
  title = "Annuler l'assignation",
  message,
}) => {
  return (
    <ChoiceModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message || "Êtes-vous sûr de vouloir annuler l'assignation ?"}
      buttons={[
        {
          variant: 'danger',
          text: "Confirmer l'annulation",
          onClick: onClose,
        },
        {
          variant: 'cancel',
          text: 'Retour',
          onClick: onClose,
        },
      ]}
    />
  );
};

export default CancelAssignmentModal;
