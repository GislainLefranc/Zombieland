//// Dossier : src/components/Modal, Fichier : ViewModal.tsx
// Composant générique de visualisation (lecture seule) d'une modal avec header (logo + titre)
// et un bouton de fermeture. Il est utilisé pour afficher divers détails sans modification.

import React from 'react';
import * as baseStyles from '../../../styles/Modals/Modal.css';
import Button from '../../Button/Button';

export interface ViewModalProps {
  isOpen: boolean;         // Indique si la modal est ouverte
  onClose: () => void;     // Fonction pour fermer la modal
  title: string;           // Titre affiché dans le header de la modal
  onEdit: () => void;      // Action d'édition (peut être undefined)
  children: React.ReactNode; // Contenu principal de la modal
}

const ViewModal: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  title,
  onEdit,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className={baseStyles.overlay} onClick={onClose}>
      <div
        className={baseStyles.content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button className={baseStyles.closeBtn} onClick={onClose}>
          &times;
        </button>
        {/* Header avec logo et titre */}
        <div className={baseStyles.header}>
          <img
            src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png"
            alt="Logo Welleat"
            className={baseStyles.logo}
          />
          <h2>{title}</h2>
        </div>
        {/* Contenu principal */}
        <div style={{ padding: '1rem' }}>
          {children}
        </div>
        {/* Bouton de fermeture en bas */}
        <div style={{ textAlign: 'right', margin: '1rem' }}>
          <Button
            variant="secondary"
            text="Fermer"
            onClick={onClose}
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
