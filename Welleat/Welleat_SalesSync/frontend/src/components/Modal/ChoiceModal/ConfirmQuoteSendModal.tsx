//// Dossier : src/components/Modal/ChoiceModal, Fichier : ConfirmQuoteSendModal.tsx

import React from 'react';
import ChoiceModal from './ChoiceModal';

interface ConfirmQuoteSendModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  onConfirm: () => void; // Fonction appelée lors de la confirmation d'envoi
  quoteId: number; // Identifiant du devis
  title?: string; // Titre de la modal
  message?: string; // Message affiché dans la modal
}

const ConfirmQuoteSendModal: React.FC<ConfirmQuoteSendModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  quoteId,
  title = "Confirmer l'envoi",
  message,
}) => {
  return (
    <ChoiceModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message || `Voulez-vous envoyer le devis n°${quoteId} ?`}
      buttons={[
        {
          variant: 'submit',
          text: 'Envoyer',
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

export default ConfirmQuoteSendModal;
