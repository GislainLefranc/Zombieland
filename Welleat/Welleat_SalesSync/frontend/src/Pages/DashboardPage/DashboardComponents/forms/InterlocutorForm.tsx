// Dossier : src/components/DashboardComponents/modals/forms/InterlocutorForm.tsx
// Fichier : InterlocutorForm.tsx
// Ce composant affiche un formulaire de création d'un interlocuteur.
// Il utilise axios pour envoyer les données au backend et affiche des notifications toast selon le résultat.

import React, { useState } from 'react';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'react-toastify';
import * as styles from '../modals/AssignModal/AssignModal.css';
import Button from '../../../../components/Button/Button';

interface InterlocutorFormProps {
  onClose: () => void;
}

const InterlocutorForm: React.FC<InterlocutorFormProps> = ({ onClose }) => {
  // États locaux pour stocker les valeurs des champs du formulaire
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      // Appel à l'API pour créer un nouvel interlocuteur
      await axiosInstance.post('/interlocutors', {
        firstName,
        lastName,
        email,
      });
      toast.success('Interlocuteur créé avec succès');
      onClose(); // Ferme la modal après succès
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de l'interlocuteur");
    }
  };

  return (
    <form className={styles.section} onSubmit={handleSubmit}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Créer un Interlocuteur</h3>
      </div>
      <div>
        <label className={styles.sectionTitle}>
          Prénom:
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            className={styles.listItem}
          />
        </label>
      </div>
      <div>
        <label className={styles.sectionTitle}>
          Nom:
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            className={styles.listItem}
          />
        </label>
      </div>
      <div>
        <label className={styles.sectionTitle}>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={styles.listItem}
          />
        </label>
      </div>
      <div className={styles.modalFooter}>
        <Button
          variant="cancel"
          text="Annuler"
          onClick={onClose}
          className={styles.cancelButton}
        />
        <Button
          variant="submit"
          text="Créer"
          type="submit"
          className={styles.assignButton}
        />
      </div>
    </form>
  );
};

export default InterlocutorForm;