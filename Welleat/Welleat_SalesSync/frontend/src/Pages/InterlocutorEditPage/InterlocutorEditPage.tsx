// Dossier : /c:/Users/docje/OneDrive/Documents/Code/Welleat/Welleat_Compare/frontend/src/Pages/InterlocutorEditPage | Fichier : InterlocutorEditPage.tsx
// Ce composant permet la modification d'un interlocuteur existant.

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import { useCompanyForm } from '../../context/CompanyFormContext';
import axiosInstance from '../../api/axiosInstance';
import Button from '../../components/Button/Button';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import * as styles from '../../styles/PagesStyles/InterlocutorsPages.css';

interface InterlocutorFormData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  comment: string;
  interlocutorType: 'client potentiel' | 'client' | 'ambassadeur';
  isIndependent: boolean;
  isPrincipal?: boolean;
}

const defaultFormData: InterlocutorFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  comment: '',
  interlocutorType: 'client potentiel',
  isIndependent: true,
};

const InterlocutorEditPage: React.FC = () => {
  const { id: interlocutorId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formData, fetchCompanyData, setPrincipalInterlocutor } = useCompanyForm();

  const [interlocutorData, setInterlocutorData] = useState<InterlocutorFormData>(defaultFormData);
  const [companyInterlocutors, setCompanyInterlocutors] = useState<InterlocutorFormData[]>([]);

  // Récupération des données de l'interlocuteur à modifier
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/interlocutors/${interlocutorId}`);
        const data = response.data;
        setInterlocutorData({
          ...data,
          firstName: data.firstName || data.first_name || '',
          lastName: data.lastName || data.last_name || '',
        });
      } catch (error: any) {
        console.error('Erreur lors de la récupération de l’interlocuteur :', error);
        toast.error('Erreur lors de la récupération de l’interlocuteur.');
      }
    };

    if (interlocutorId) {
      fetchData();
    }
  }, [interlocutorId]);

  // Mise à jour de la liste des interlocuteurs de l'entreprise depuis le contexte
  useEffect(() => {
    if (formData && formData.interlocutors) {
      const interlocutorFormData = formData.interlocutors.map(interlocutor => ({
        id: interlocutor.id,
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        email: interlocutor.email,
        phone: interlocutor.phone,
        position: interlocutor.position,
        comment: interlocutor.comment,
        interlocutorType: interlocutor.interlocutorType,
        isIndependent: interlocutor.isIndependent,
        isPrincipal: interlocutor.isPrincipal,
      }));
      setCompanyInterlocutors(interlocutorFormData);
    }
  }, [formData.interlocutors]);

  // Gestion des changements sur le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInterlocutorData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumission du formulaire de modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      firstName: interlocutorData.firstName.trim(),
      lastName: interlocutorData.lastName.trim(),
      email: interlocutorData.email.trim(),
      phone: interlocutorData.phone?.trim() || null,
      position: interlocutorData.position?.trim() || null,
      comment: interlocutorData.comment?.trim() || '',
      interlocutorType: interlocutorData.interlocutorType,
      isIndependent: interlocutorData.isIndependent,
    };

    if (!formattedData.firstName || !formattedData.lastName || !formattedData.email) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formattedData.email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      const response = await axiosInstance.put(`/interlocutors/${interlocutorId}`, formattedData);
      if (response.data) {
        toast.success('Interlocuteur modifié avec succès');
        if (formData && formData.id) {
          await fetchCompanyData(formData.id.toString());
        }
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour :', error);
      let errorMessage = 'Erreur lors de la modification';
      if (error.response?.data?.error) {
        errorMessage = Array.isArray(error.response.data.error)
          ? error.response.data.error[0]
          : error.response.data.error;
      }
      toast.error(errorMessage);
    }
  };

  // Réinitialisation du formulaire
  const handleReset = () => {
    setInterlocutorData(defaultFormData);
  };

  // Annulation et retour à la page précédente
  const handleCancel = () => {
    navigate(-1);
  };

  // Gestion du changement de l'interlocuteur principal
  const handleSetPrincipal = async (selectedId: number) => {
    if (!formData || !formData.id) {
      toast.error("Impossible de définir l'interlocuteur principal : ID de l'entreprise manquant.");
      return;
    }
    try {
      await axiosInstance.put(`/assign/set-principal-interlocutor/${formData.id}/${selectedId}`, {
        userId: interlocutorData.userId,
        interlocutorId: selectedId,
      });
      setCompanyInterlocutors(prevInterlocutors => {
        const updatedInterlocutors = prevInterlocutors.map(interloc => {
          return interloc.id === selectedId ? { ...interloc, isPrincipal: true } : { ...interloc, isPrincipal: false };
        });
        return updatedInterlocutors;
      });
      toast.success("Interlocuteur principal mis à jour avec succès !");
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l’interlocuteur principal :', error);
      toast.error("Erreur lors de la mise à jour de l'interlocuteur principal.");
    }
  };

  return (
    <GreenBackground>
      <div className={styles.interlocutorForm}>
        <h2 className={styles.formTitle}>Modification de l’interlocuteur</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">Prénom *</label>
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
            <label htmlFor="lastName">Nom *</label>
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
            <label htmlFor="email">Email *</label>
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
            <label htmlFor="position">Poste *</label>
            <input
              className={styles.formInput}
              type="text"
              id="position"
              name="position"
              value={interlocutorData.position}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="comment">Commentaire</label>
            <textarea
              className={`${styles.formInput} ${styles.textarea}`}
              id="comment"
              name="comment"
              value={interlocutorData.comment}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="interlocutorType">Type d’interlocuteur *</label>
            <select
              className={styles.formInput}
              id="interlocutorType"
              name="interlocutorType"
              value={interlocutorData.interlocutorType}
              onChange={handleChange}
              required
            >
              <option value="client potentiel">Client Potentiel</option>
              <option value="client">Client</option>
              <option value="ambassadeur">Ambassadeur</option>
            </select>
          </div>
          {/* Section pour changer l'interlocuteur principal */}
          <div className={styles.inputGroup}>
            <label>Changer l'interlocuteur principal de l'établissement</label>
            {companyInterlocutors.map(interloc => (
              <div key={interloc.id}>
                <div>
                  {interloc.firstName} {interloc.lastName}
                  {interloc.isPrincipal && (
                    <span style={{ color: "#13674e", fontWeight: 'bold', marginLeft: '5px' }}>
                      (Interlocuteur Principal)
                    </span>
                  )}
                </div>
                <div
                  onClick={() => handleSetPrincipal(interloc.id!)}
                  style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                  title={
                    interloc.isPrincipal
                      ? "Cet interlocuteur est actuellement principal. Cliquez pour le changer."
                      : "Cliquez pour définir cet interlocuteur comme principal."
                  }
                >
                  <FaStar color={interloc.isPrincipal ? "#FFD700" : "#ccc"} size={20} />
                </div>
              </div>
            ))}
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

export default InterlocutorEditPage;
