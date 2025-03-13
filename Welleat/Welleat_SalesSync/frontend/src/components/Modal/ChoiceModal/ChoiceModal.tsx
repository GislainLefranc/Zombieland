//// Dossier : src/components/Modal/ChoiceModal, Fichier : ChoiceModal.tsx

import React from 'react';
import * as styles from './ChoiceModal.css';
import Button from '@/components/Button/Button';

interface ModalButton {
  variant: string; // Variante du bouton (sera mappée aux styles du bouton)
  text: string; // Texte affiché sur le bouton
  onClick: () => void; // Fonction appelée lors du clic
  disabled?: boolean; // Indique si le bouton est désactivé
}

interface ChoiceModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  title: string; // Titre de la modal
  message?: string; // Message à afficher dans la modal
  buttons: ModalButton[]; // Liste des boutons d'action
  className?: string; // Classe CSS additionnelle
  children?: React.ReactNode; // Contenu additionnel de la modal
}

const ChoiceModal: React.FC<ChoiceModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttons,
  className,
  children,
}) => {
  if (!isOpen) return null;

  // Ferme la modal si on clique sur l'overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`${styles.simulationModalOverlay} ${className || ''}`} onClick={handleOverlayClick}>
      <div className={styles.simulationModalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.simulationModalCloseBtn} onClick={onClose} aria-label="Fermer la modal">
          &times;
        </button>
        <div className={styles.modalHeader}>
          <img
            src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png"
            alt="Logo Welleat"
            className={styles.modalLogo}
          />
          <h2 className={styles.modalTitle}>{title}</h2>
        </div>
        {message && <p className={styles.simulationModalMessage}>{message}</p>}
        {children}
        <div className={styles.modalButtons}>
          {buttons.map((btn, index) => (
            <Button
              key={index}
              variant={
                btn.variant === 'cancel'
                  ? 'modalCancel'
                  : btn.variant === 'danger'
                  ? 'modalDanger'
                  : 'modalSend'
              }
              text={btn.text}
              onClick={btn.onClick}
              disabled={btn.disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChoiceModal;
