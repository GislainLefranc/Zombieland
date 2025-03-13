//// Dossier : src/components/Modal/ChoiceModal, Fichier : EstablishmentChoiceModal.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import * as styles from './ChoiceModal.css';
import Button from '@/components/Button/Button';

interface EstablishmentChoiceModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  onExistingEstablishment: () => void; // Action pour choisir un établissement existant
  onNewEstablishment: () => void; // Action pour créer un nouvel établissement
  companies: Array<{ id: number; name: string }>; // Liste des établissements disponibles
  onCompanySelect: (company: { id: number; name: string }) => void; // Sélection d'un établissement
  showCompanyForm: boolean; // Afficher le formulaire de création
  newCompanyData: { name: string }; // Données pour le nouvel établissement
  handleCompanyChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Gestion du changement dans le formulaire
  handleCompanySubmit: (e: React.FormEvent) => void; // Soumission du formulaire de création
}

const EstablishmentChoiceModal: React.FC<EstablishmentChoiceModalProps> = ({
  isOpen,
  onClose,
  onExistingEstablishment,
  onNewEstablishment,
  companies,
  onCompanySelect,
  showCompanyForm,
  newCompanyData,
  handleCompanyChange,
  handleCompanySubmit,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.simulationModalOverlay} onClick={onClose}>
      <div className={styles.simulationModalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.simulationModalCloseBtn} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalHeader}>
          <img
            src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png"
            alt="Logo Welleat"
            className={styles.modalLogo}
          />
          <h2 className={styles.modalTitle}>
            Attribuer la simulation à un établissement
          </h2>
        </div>
        <div className={styles.optionsContainer}>
          <Button
            variant="simulation"
            text="Établissement existant"
            onClick={onExistingEstablishment}
          />
          <Button
            variant="simulation"
            text="Nouvel établissement"
            onClick={onNewEstablishment}
          />
        </div>
        {!showCompanyForm ? (
          <div className={styles.companyList}>
            {companies.map(company => (
              <div
                key={company.id}
                className={styles.companyItem}
                onClick={() => onCompanySelect(company)}
              >
                {company.name}
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleCompanySubmit} className={styles.companyForm}>
            <h3 className={styles.simulationModalTitle}>
              Créer une nouvelle entreprise
            </h3>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="name">
                Nom de l'établissement
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.formInput}
                value={newCompanyData.name}
                onChange={handleCompanyChange}
                required
              />
            </div>
            <Button type="submit" variant="modalSend" text="Créer l'entreprise" />
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

export default EstablishmentChoiceModal;
