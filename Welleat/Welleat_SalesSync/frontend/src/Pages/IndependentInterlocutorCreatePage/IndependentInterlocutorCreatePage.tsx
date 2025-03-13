// Dossier : src/Pages | Fichier : IndependentInterlocutorCreatePage.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import Button from '../../components/Button/Button';
import axiosInstance from '../../api/axiosInstance';
import * as styles from '../../styles/PagesStyles/InterlocutorsPages.css';
import { Interlocutor } from '../../types/companyInterlocutorTypes';

const IndependentInterlocutorCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  // État initial de l'interlocuteur avec type fixé à "client potentiel" et indépendance activée
  const [interlocutorData, setInterlocutorData] = useState<Partial<Interlocutor>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    comment: '',
    interlocutorType: 'client potentiel',
    isPrincipal: false,
    isIndependent: true,
    uniqueKey: uuidv4(),
  });

  // Gestion des modifications des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInterlocutorData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumission du formulaire de création/modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construction du payload en conservant la valeur fixe du type
    const payload: Partial<Interlocutor> = {
      firstName: interlocutorData.firstName?.trim(),
      lastName: interlocutorData.lastName?.trim(),
      email: interlocutorData.email?.trim(),
      phone: interlocutorData.phone?.trim() || null,
      position: interlocutorData.position?.trim() || null,
      comment: interlocutorData.comment?.trim() || null,
      interlocutorType: 'client potentiel',
      isPrincipal: interlocutorData.isPrincipal || false,
      isIndependent: true,
      uniqueKey: interlocutorData.uniqueKey || uuidv4(),
    };

    // Vérification des champs obligatoires
    const requiredFields: { [key: string]: string } = {
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      position: 'Poste',
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !payload[key as keyof typeof payload])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      toast.error(`Champs requis manquants : ${missingFields.join(', ')}`);
      return;
    }

    try {
      // Envoi de la requête de création d'interlocuteur
      const response = await axiosInstance.post('/interlocutors', payload);
      console.log('Réponse du serveur:', response.data);
      toast.success('Interlocuteur indépendant créé avec succès');
      navigate('/dashboard');
    } catch (error: any) {
      // Gestion des erreurs de validation ou autres erreurs de requête
      if (error.response?.data?.errors) {
        const errorMessages = Array.isArray(error.response.data.errors)
          ? error.response.data.errors
              .map((err: any) => err.message || JSON.stringify(err))
              .join('\n')
          : error.response.data.errors.message || 'Erreur de validation';
        toast.error(errorMessages);
      } else {
        toast.error("Erreur lors de la création de l'interlocuteur");
      }
      console.error('Détails de l’erreur:', error.response?.data);
    }
  };

  // Réinitialise les champs du formulaire
  const handleReset = () => {
    setInterlocutorData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      comment: '',
      interlocutorType: 'client potentiel',
      isPrincipal: false,
      isIndependent: true,
      uniqueKey: uuidv4(),
    });
  };

  // Annule l'opération et retourne au tableau de bord
  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <GreenBackground>
      <div className={styles.interlocutorForm}>
        <h2 className={styles.formTitle}>
          {id ? 'Modification de l’interlocuteur' : 'Création d’un interlocuteur indépendant'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">Prénom *</label>
            <input
              className={styles.formInput}
              type="text"
              name="firstName"
              id="firstName"
              value={interlocutorData.firstName || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Nom *</label>
            <input
              className={styles.formInput}
              type="text"
              name="lastName"
              id="lastName"
              value={interlocutorData.lastName || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email *</label>
            <input
              className={styles.formInput}
              type="email"
              name="email"
              id="email"
              value={interlocutorData.email || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Téléphone</label>
            <input
              className={styles.formInput}
              type="text"
              name="phone"
              id="phone"
              value={interlocutorData.phone || ''}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="position">Poste *</label>
            <input
              className={styles.formInput}
              type="text"
              name="position"
              id="position"
              value={interlocutorData.position || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="comment">Commentaire</label>
            <textarea
              className={styles.formInput}
              name="comment"
              id="comment"
              value={interlocutorData.comment || ''}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className={styles.buttonsContainer}>
            <Button variant="submit" size="medium" text={id ? 'Modifier' : 'Créer'} type="submit" />
            <Button variant="cancel" size="medium" text="Annuler" onClick={handleCancel} />
            <Button variant="danger" size="medium" text="Réinitialiser" onClick={handleReset} />
          </div>
        </form>
      </div>
    </GreenBackground>
  );
};

export default IndependentInterlocutorCreatePage;
