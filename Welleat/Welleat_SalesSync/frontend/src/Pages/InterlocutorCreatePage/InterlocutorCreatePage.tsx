// Dossier : src/pages/InterlocutorCreatePage | Fichier : InterlocutorCreatePage.tsx
// Ce composant permet de créer un nouvel interlocuteur et de l'ajouter dans le contexte de l'entreprise.

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import Button from '../../components/Button/Button';
import { CompanyFormContext } from '../../context/CompanyFormContext';
import { v4 as uuidv4 } from 'uuid';
import { Interlocutor, InterlocutorType } from '../../types/index';
import * as styles from '../../styles/PagesStyles/InterlocutorsPages.css';

const InterlocutorCreatePage = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useContext(CompanyFormContext);

  // État local pour stocker les données de l'interlocuteur
  const [interlocutorData, setInterlocutorData] = useState<Partial<Interlocutor>>({
    id: Date.now(),
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    comment: '',
    interlocutorType: 'client potentiel' as InterlocutorType,
    isPrincipal: false,
    isIndependent: false,
    uniqueKey: uuidv4(),
  });

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajout de l'interlocuteur dans le contexte de l'entreprise
    setFormData(prev => ({
      ...prev,
      interlocutors: [...prev.interlocutors, interlocutorData as Interlocutor],
    }));
    navigate(-1);
  };

  // Réinitialisation du formulaire
  const handleReset = () => {
    setInterlocutorData({
      id: Date.now(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      comment: '',
      interlocutorType: 'client potentiel',
      isPrincipal: false,
      isIndependent: false,
      uniqueKey: uuidv4(),
    });
  };

  // Annulation de l'opération et retour à la page précédente
  const handleCancel = () => {
    navigate(-1);
  };

  // Gestion des changements sur les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInterlocutorData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <GreenBackground>
      <div className={styles.interlocutorForm}>
        <h2 className={styles.formTitle}>Création d’un interlocuteur</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">Prénom</label>
            <input
              className={styles.formInput}
              type="text"
              id="firstName"
              name="firstName"
              value={interlocutorData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Nom</label>
            <input
              className={styles.formInput}
              type="text"
              id="lastName"
              name="lastName"
              value={interlocutorData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              className={styles.formInput}
              type="email"
              id="email"
              name="email"
              value={interlocutorData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Téléphone</label>
            <input
              className={styles.formInput}
              type="text"
              id="phone"
              name="phone"
              value={interlocutorData.phone}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="position">Poste</label>
            <input
              className={styles.formInput}
              type="text"
              id="position"
              name="position"
              value={interlocutorData.position}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="comment">Commentaire</label>
            <textarea
              className={`${styles.formInput} ${styles.textarea}`}
              name="comment"
              id="comment"
              value={interlocutorData.comment}
              onChange={handleChange}
            />
          </div>
          <div className={styles.buttonsContainer}>
            <Button variant="submit" size="medium" text="Sauvegarder" type="submit" />
            <Button variant="cancel" size="medium" text="Annuler" onClick={handleCancel} type="button" />
            <Button variant="danger" size="medium" text="Réinitialiser" onClick={handleReset} type="button" />
          </div>
        </form>
      </div>
    </GreenBackground>
  );
};

export default InterlocutorCreatePage;
