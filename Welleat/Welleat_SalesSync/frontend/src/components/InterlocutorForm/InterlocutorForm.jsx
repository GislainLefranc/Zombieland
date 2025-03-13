//// Dossier : src/components, Fichier : InterlocutorForm.jsx

import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import * as styles from './InterlocutorForm.css.ts';

const InterlocutorForm = ({ initialData = {}, onSubmit, onClose, title }) => {
  // Initialisation des données du formulaire avec des valeurs par défaut
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
  });

  // État pour indiquer si l'interlocuteur est principal
  const [isPrincipal, setIsPrincipal] = useState(false);

  // Mise à jour des données du formulaire en cas de données initiales fournies
  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
    if (initialData.interlocutor) {
      setIsPrincipal(initialData.interlocutor.isPrincipal || false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Gestion des changements dans les champs du formulaire
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestion de la soumission du formulaire avec vérification des champs requis
  const handleSubmit = e => {
    e.preventDefault();
    const requiredFields = ['firstName', 'lastName', 'email', 'position'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs requis : ' + missingFields.join(', '));
      return;
    }
    onSubmit(formData, isPrincipal);
  };

  return (
    <div className={styles.interlocutorForm}>
      <h2 className={styles.formTitle}>{title}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Nom *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="firstName" className={styles.label}>
            Prénom *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.label}>
            Téléphone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Entrez le numéro de téléphone"
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="position" className={styles.label}>
            Poste *
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.buttonsContainer}>
          <div className={`${styles.buttonGroup} ${styles.buttonsContainerButtonGroup}`}>
            <Button text="Sauvegarder" type="submit" className={styles.button} />
            <Button text="Annuler" onClick={onClose} className={styles.button} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default InterlocutorForm;
