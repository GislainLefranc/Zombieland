/**
 * Dossier : src/DashboardComponents
 * Fichier : PendingMessage.tsx
 *
 * Ce fichier définit le composant PendingMessage qui affiche un message d'attente
 * avec un bouton pour réaliser une action (ex : annuler une assignation).
 */

import React from 'react';
import * as styles from './styles/PendingMessage.css';
import Button from '../../../components/Button/Button';

interface PendingMessageProps {
  message: string;
  buttonText: string;
  onClick: () => void;
}

const PendingMessage: React.FC<PendingMessageProps> = ({
  message,
  buttonText,
  onClick,
}) => {
  return (
    <div className={styles.pendingMessage}>
      <span>{message}</span>
      <Button
        variant="danger"
        size="small"
        text={buttonText}
        onClick={onClick}
      />
    </div>
  );
};

export default PendingMessage;
