//// Dossier : src/components/Modal/ChoiceModal, Fichier : ConfirmationModal.tsx

import React from 'react';
import ChoiceModal from './ChoiceModal';

interface ConfirmationModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  onConfirm: () => void; // Fonction appelée lors de la confirmation
  companyName: string; // Nom de l'établissement concerné
  title?: string; // Titre de la modal
  message?: string; // Message affiché dans la modal
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  companyName,
  title = 'Confirmation',
  message,
}) => {
  return (
    <ChoiceModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message || `Voulez-vous assigner cette simulation à l'établissement "${companyName}" ?`}
      buttons={[
        {
          variant: 'submit',
          text: 'Confirmer',
          onClick: onConfirm,
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

export default ConfirmationModal;
