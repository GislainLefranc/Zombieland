//// Dossier : src/components/Modal/ChoiceModal/Mailing, Fichier : EmailModal.tsx

import React from 'react';
import ChoiceModal from '../ChoiceModal';
import Button from '@/components/Button/Button';
import * as styles from '../ChoiceModal.css';

interface EmailModalProps {
  isOpen: boolean; // Indique si la modal est ouverte
  onClose: () => void; // Fonction pour fermer la modal
  emailInput: string; // Valeur de l'input email
  setEmailInput: (email: string) => void; // Fonction pour mettre à jour l'input email
  handleAddEmail: () => void; // Ajoute l'email saisi à la liste
  emails: string[]; // Liste des emails ajoutés
  handleRemoveEmail: (index: number) => void; // Supprime un email de la liste
  handleSendEmails: () => void; // Envoi des emails
  isSendingEmail: boolean; // Indique si l'envoi est en cours
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  emailInput,
  setEmailInput,
  handleAddEmail,
  emails,
  handleRemoveEmail,
  handleSendEmails,
  isSendingEmail,
}) => {
  if (!isOpen) return null;

  return (
    <ChoiceModal
      isOpen={isOpen}
      onClose={onClose}
      title="Envoyer par Email"
      message=""
      buttons={[
        {
          variant: 'modalSend',
          text: isSendingEmail ? 'Envoi en cours...' : 'Envoyer',
          onClick: handleSendEmails,
          disabled: emails.length === 0 || isSendingEmail,
        },
        {
          variant: 'cancel',
          text: 'Annuler',
          onClick: onClose,
        },
      ]}
    >
      <div className={styles.emailInputSection}>
        <label htmlFor="emailInput" className={styles.hiddenLabel}>
          Adresse Email
        </label>
        <input
          id="emailInput"
          type="email"
          className={styles.modalEmailInput}
          placeholder="Entrez une adresse email"
          value={emailInput}
          onChange={e => setEmailInput(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              handleAddEmail();
            }
          }}
        />
        <Button
          variant="add"
          text="Ajouter"
          onClick={handleAddEmail}
          disabled={!emailInput.trim()}
        />
      </div>
      <ul className={styles.modalEmailList}>
        {emails.map((email, index) => (
          <li key={index} className={styles.modalEmailListItem}>
            <span>{email}</span>
            <Button
              variant="danger"
              text="Supprimer"
              onClick={() => handleRemoveEmail(index)}
            />
          </li>
        ))}
      </ul>
    </ChoiceModal>
  );
};

export default EmailModal;
