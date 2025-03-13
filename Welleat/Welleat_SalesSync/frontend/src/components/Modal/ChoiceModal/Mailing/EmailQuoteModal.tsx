//// Dossier : src/components/Modal/ChoiceModal/Mailing, Fichier : EmailQuoteModal.tsx

import React, { useEffect, useState, KeyboardEvent } from 'react';
import ChoiceModal from '../ChoiceModal';
import Button from '@/components/Button/Button';
import * as styles from '../ChoiceModal.css';

interface Interlocutor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Company {
  id: number;
  name: string;
  interlocutors?: Interlocutor[];
}

interface ExtendedQuote {
  id: number;
  company: Company;
  interlocutors: Interlocutor[];
}

interface EmailQuoteModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  quote: ExtendedQuote | null; // Devis sélectionné
  handleSendEmail: (quoteId: number, allEmails: string[]) => void; // Envoi du devis par email
  isSendingEmail: boolean; // Indique si l'envoi est en cours
}

const EmailQuoteModal: React.FC<EmailQuoteModalProps> = ({
  isOpen,
  onClose,
  quote,
  handleSendEmail,
  isSendingEmail,
}) => {
  const [additionalEmailInput, setAdditionalEmailInput] = useState('');
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [defaultEmails, setDefaultEmails] = useState<string[]>([]);

  useEffect(() => {
    if (quote) {
      const mainEmails = quote.interlocutors.map(i => i.email);
      const companyEmails = quote.company.interlocutors?.map(i => i.email) || [];
      const uniqueEmails = [...new Set([...mainEmails, ...companyEmails])];
      setDefaultEmails(uniqueEmails);
      setAdditionalEmails([]);
      setAdditionalEmailInput('');
    }
  }, [quote]);

  if (!isOpen || !quote) return null;

  const handleAddEmail = () => {
    const email = additionalEmailInput.trim();
    if (email && !additionalEmails.includes(email) && !defaultEmails.includes(email)) {
      setAdditionalEmails(prev => [...prev, email]);
      setAdditionalEmailInput('');
    }
  };

  const handleRemoveAdditionalEmail = (index: number) => {
    setAdditionalEmails(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSendEmails = () => {
    const allEmails = [...defaultEmails, ...additionalEmails];
    handleSendEmail(quote.id, allEmails);
  };

  return (
    <ChoiceModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Envoyer le Devis #${quote.id} par Email`}
      message=""
      buttons={[
        {
          variant: 'modalSend',
          text: isSendingEmail ? 'Envoi en cours...' : 'Envoyer',
          onClick: handleSendEmails,
          disabled: isSendingEmail,
        },
        {
          variant: 'cancel',
          text: 'Fermer',
          onClick: onClose,
        },
      ]}
    >
      <h3 className={styles.modalTitle} style={{ textAlign: 'left', fontSize: '1.2rem', color: '#ffffff' }}>
        Destinataires
      </h3>
      <ul className={styles.modalEmailList}>
        {quote.interlocutors.map(interlocutor => (
          <li key={interlocutor.id} className={styles.modalEmailListItem}>
            {interlocutor.firstName} {interlocutor.lastName} - {interlocutor.email}
          </li>
        ))}
      </ul>
      <div className={styles.emailInputSection}>
        <label htmlFor="additionalEmail" className={styles.hiddenLabel}>
          Adresse Email
        </label>
        <input
          id="additionalEmail"
          type="email"
          className={styles.modalEmailInput}
          placeholder="Ajouter une adresse email"
          value={additionalEmailInput}
          onChange={e => setAdditionalEmailInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="add"
          text="Ajouter"
          onClick={handleAddEmail}
          disabled={!additionalEmailInput.trim()}
        />
      </div>
      {additionalEmails.length > 0 && (
        <>
          <h3 className={styles.modalTitle} style={{ textAlign: 'left', fontSize: '1.2rem', color: '#ffffff' }}>
            Adresses ajoutées
          </h3>
          <ul className={styles.modalEmailList}>
            {additionalEmails.map((email, index) => (
              <li key={index} className={styles.modalEmailListItem}>
                <span>{email}</span>
                <Button variant="danger" text="Supprimer" onClick={() => handleRemoveAdditionalEmail(index)} />
              </li>
            ))}
          </ul>
        </>
      )}
    </ChoiceModal>
  );
};

export default EmailQuoteModal;
