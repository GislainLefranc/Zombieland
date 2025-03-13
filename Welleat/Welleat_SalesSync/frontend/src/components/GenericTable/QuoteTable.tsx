//// Dossier : src/components/GenericTable, Fichier : QuoteTable.tsx

import React, { useState, useEffect } from 'react';
import * as styles from './QuoteTable.css';
import { Quote } from '../../types';
import { ExtendedQuote } from '../../types/quotesTypes';
import SendIcon from '../../styles/icons/SendIcon';
import DeleteIcon from '../../styles/icons/DeleteIcon';
import ConfirmQuoteSendModal from '../../components/Modal/ChoiceModal/ConfirmQuoteSendModal';
import EmailQuoteModal from '../../components/Modal/ChoiceModal/Mailing/EmailQuoteModal';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

interface QuoteTableProps {
  quotes: Quote[];                     // Liste des devis à afficher
  onDelete: (quote: Quote) => void;      // Fonction pour supprimer un devis
  onRowClick: (quote: Quote) => void;    // Fonction pour gérer le clic sur une ligne
  onSend: (quote: Quote) => void;        // Fonction pour envoyer un devis
}

// Composant d'affichage des devis sous forme de tableau
const QuoteTable: React.FC<QuoteTableProps> = ({ quotes, onDelete, onRowClick, onSend }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Fonction pour envoyer un email avec le devis et la liste d'emails fournie
  const handleSendEmail = async (quoteId: number, toEmails: string[]) => {
    try {
      setIsSendingEmail(true);
      await axiosInstance.post(`/emails/send-quote/${quoteId}`, { toEmails });
      setIsSendingEmail(false);
      setIsEmailModalOpen(false);
      toast.success('Devis envoyé avec succès');
    } catch (error) {
      console.error("Erreur lors de l'envoi du devis:", error);
      setIsSendingEmail(false);
      toast.error("Erreur lors de l'envoi du devis");
    }
  };

  // Ouvre le modal d'envoi d'email
  const handleSendClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsEmailModalOpen(true);
  };

  // Gère le clic sur le bouton d'envoi avec validation
  const handleSendClickWithValidation = (quote: Quote, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!quote) {
      toast.error('Aucun devis sélectionné');
      return;
    }
    // Vérifie la présence d'une entreprise associée au devis
    if (!quote.company_id && !quote.companyId) {
      toast.error('Aucune entreprise associée au devis');
      return;
    }
    if (quote.interlocutors && quote.interlocutors.length > 0) {
      setSelectedQuote(quote);
      setIsEmailModalOpen(true);
    } else {
      toast.warning('Aucun interlocuteur trouvé pour ce devis');
    }
  };

  // Gère la confirmation d'envoi depuis le modal de confirmation
  const handleConfirmSend = async () => {
    if (selectedQuote) {
      try {
        onSend(selectedQuote);
        setIsConfirmModalOpen(false);
      } catch (error) {
        console.error("Erreur lors de l'envoi:", error);
        toast.error("Erreur lors de l'envoi du devis.");
      }
    }
  };

  // Suivi des changements d'état pour le débogage
  useEffect(() => {
    console.log('Changements d\'état:', { isEmailModalOpen, selectedQuote, isSendingEmail });
  }, [isEmailModalOpen, selectedQuote, isSendingEmail]);

  if (quotes.length === 0) {
    return <div className={styles.noResults}>Aucun devis trouvé.</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.quoteTable}>
        <thead className={styles.quoteTableHead}>
          <tr>
            <th className={styles.quoteTableHeader}>ID</th>
            <th className={styles.quoteTableHeader}>Utilisateur</th>
            <th className={styles.quoteTableHeader}>Entreprise</th>
            <th className={`${styles.quoteTableHeader} ${styles.hideOnMobile}`}>Statut</th>
            <th className={`${styles.quoteTableHeader} ${styles.hideOnMobile}`}>Valide Jusqu'à</th>
            <th className={styles.quoteTableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.quoteTableBody}>
          {quotes.map((quote) => {
            // Calcul de la date d'expiration du devis
            const expirationDate = quote.validUntil
              ? new Date(quote.validUntil)
              : quote.valid_until
                ? new Date(quote.valid_until)
                : new Date(new Date(quote.created_at).setMonth(new Date(quote.created_at).getMonth() + 1));

            return (
              <tr
                key={quote.id}
                className={styles.quoteTableRow}
                onClick={() => onRowClick(quote)}
                style={{ cursor: 'pointer' }}
              >
                <td className={styles.quoteTableCell}>{quote.id}</td>
                <td className={styles.quoteTableCell}>
                  {quote.user
                    ? `${quote.user.firstName || quote.user.first_name || ''} ${quote.user.lastName || quote.user.last_name || ''}`.trim() || `User ${quote.user_id}`
                    : `User ${quote.user_id}`}
                </td>
                <td className={styles.quoteTableCell}>
                  {quote.company && quote.company.name ? quote.company.name : 'N/A'}
                </td>
                <td className={`${styles.quoteTableCell} ${styles.hideOnMobile}`}>
                  {quote.status}
                </td>
                <td className={`${styles.quoteTableCell} ${styles.hideOnMobile}`}>
                  {expirationDate.toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
                <td className={styles.quoteTableCell}>
                  <button 
                    onClick={(e) => handleSendClickWithValidation(quote, e)}
                    className={styles.actionButton}
                    title="Envoyer le devis"
                  >
                    <SendIcon />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(quote); }}
                    className={styles.actionButton}
                    title="Supprimer le devis"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <ConfirmQuoteSendModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        quote={selectedQuote}
        onConfirm={handleConfirmSend}
      />

      <EmailQuoteModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        quote={selectedQuote as ExtendedQuote}
        handleSendEmail={handleSendEmail}
        isSendingEmail={isSendingEmail}
      />
    </div>
  );
};

export default QuoteTable;
