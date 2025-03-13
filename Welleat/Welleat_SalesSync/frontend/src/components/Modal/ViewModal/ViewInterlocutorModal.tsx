//// Dossier : src/components/Modal, Fichier : InterlocutorDetailsModal.tsx
// Cette modal affiche les détails d'un interlocuteur et permet de naviguer vers son édition.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button/Button';
import * as modalStyles from '../../../styles/Modals/Modal.css';
import CreateModal from '../CreateModal/CreateModal';

interface Interlocutor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
}

interface InterlocutorDetailsModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  interlocutor: Interlocutor; // Détails de l'interlocuteur à afficher
}

const InterlocutorDetailsModal: React.FC<InterlocutorDetailsModalProps> = ({
  isOpen,
  onClose,
  interlocutor,
}) => {
  const navigate = useNavigate();

  // Navigation vers la page d'édition de l'interlocuteur
  const handleEdit = () => {
    onClose();
    navigate(`/interlocuteur/${interlocutor.id}/edit`);
  };

  // Contenu affichant les détails de l'interlocuteur
  const detailsContent = (
    <div className={modalStyles.userInfo}>
      <p>
        <strong>Prénom:</strong> {interlocutor.firstName}
      </p>
      <p>
        <strong>Nom:</strong> {interlocutor.lastName}
      </p>
      <p>
        <strong>Email:</strong> {interlocutor.email}
      </p>
      {interlocutor.phone && (
        <p>
          <strong>Téléphone:</strong> {interlocutor.phone}
        </p>
      )}
      {interlocutor.position && (
        <p>
          <strong>Position:</strong> {interlocutor.position}
        </p>
      )}
    </div>
  );

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails de l'interlocuteur"
      actions={[
        {
          variant: 'primary',
          text: 'Modifier',
          onClick: handleEdit,
          type: 'button',
        },
        {
          variant: 'secondary',
          text: 'Retour',
          onClick: onClose,
          type: 'button',
        },
      ]}
    >
      {detailsContent}
    </CreateModal>
  );
};

export default InterlocutorDetailsModal;
