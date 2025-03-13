//// Dossier : src/components/Modal/CreateModal, Fichier : CreateModal.tsx
// Ce composant générique affiche une modal de création avec un overlay,
// un header (logo et titre), le contenu (enfants) et des boutons d'action.

import React from 'react';
import * as baseStyles from '../../../styles/Modals/Modal.css';
import Button from '@/components/Button/Button';

interface CreateModalProps {
  isOpen: boolean; // Indique si la modal est affichée
  onClose: () => void; // Fonction pour fermer la modal
  title: string; // Titre affiché dans le header de la modal
  actions: {
    variant: string;
    text: string;
    onClick: () => void;
    type?: 'button' | 'submit' | 'reset';
  }[];
  children: React.ReactNode; // Contenu de la modal (formulaire, etc.)
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  title,
  actions,
  children,
}) => {
  if (!isOpen) return null;

  // Empêche la propagation du clic pour ne pas fermer la modal accidentellement
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={baseStyles.overlay} onClick={onClose}>
      <div className={baseStyles.content} onClick={stopPropagation}>
        <button 
          className={baseStyles.closeBtn} 
          onClick={onClose}
          aria-label="Fermer la modal"
        >
          &times;
        </button>
        {/* Header avec logo et titre */}
        <div className={baseStyles.header}>
          <img
            src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png"
            alt="Logo Welleat"
            className={baseStyles.logo}
          />
          <h2 style={{ margin: 0 }}>
            {title}
          </h2>
        </div>
        {/* Contenu principal de la modal */}
        <div style={{ padding: '1rem' }}>
          {children}
        </div>
        {/* Boutons d'action */}
        <div className={baseStyles.buttons}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              text={action.text}
              onClick={action.onClick}
              type={action.type || 'button'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
