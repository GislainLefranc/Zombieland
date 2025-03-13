/*
  Dossier : src/components/CompanyForm
  Fichier : CompanyForm.tsx
*/

import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

import * as styles from './CompanyForm.css';

import { CompanyFormContext } from '../../context/CompanyFormContext';
import { useCompanyInterlocutors } from '../../hooks/useCompanyInterlocutors';
import Button from '../Button/Button';
import StarIcon from '../../styles/icons/StarIcon';

import { CompanyFormData, Interlocutor } from '../../types/companyInterlocuteurTypes';

import {
  validateCompanyFormData,
  getResetCompanyFormData,
  clearFormLocalStorage,
} from '../../utils/companyFormUtils';

interface CompanyFormProps {
  title: string; // Titre du formulaire
  onSubmit: (data: CompanyFormData) => void; // Fonction appelée lors de la soumission du formulaire
  onClose: () => void; // Fonction appelée lors de la fermeture du formulaire
  isEditMode?: boolean; // Indique si le formulaire est en mode édition
  isSimulationPending?: boolean; // Indique si une simulation est en attente
  allowPrincipalChange?: boolean; // Permet de modifier l'interlocuteur principal
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  title,
  onSubmit,
  onClose,
  isEditMode = false,
  isSimulationPending = false,
  allowPrincipalChange = true,
}) => {
  // Récupération du contexte du formulaire
  const contextValue = useContext(CompanyFormContext);
  if (!contextValue) {
    throw new Error('CompanyFormContext non fourni');
  }
  const { formData, setFormData } = contextValue;

  const navigate = useNavigate();
  const location = useLocation();

  // Gestion des interlocuteurs via le hook personnalisé
  const {
    interlocutors,
    addInterlocutor,
    removeInterlocutor,
    clearProcessedEmails,
  } = useCompanyInterlocutors(formData.interlocutors);

  // Ajout d'un interlocuteur à partir de l'état de la navigation
  useEffect(() => {
    const state = location.state as { selectedInterlocutor?: Interlocutor };
    if (!state?.selectedInterlocutor) return;

    const selected = state.selectedInterlocutor;
    const exists = formData.interlocutors.some(
      (i) => i.uniqueKey === selected.uniqueKey
    );

    if (!exists) {
      addInterlocutor(selected);
      toast.success(
        `Interlocuteur ${selected.firstName} ${selected.lastName} ajouté avec succès !`
      );
    } else {
      toast.warn('Cet interlocuteur a déjà été ajouté.');
    }
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state]);

  // Synchronisation des interlocuteurs du hook avec le contexte
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      interlocutors: interlocutors.map((i) => ({
        ...i,
        id: typeof i.id === 'number' ? i.id : 0,
        uniqueKey: i.uniqueKey || `${Date.now()}-${Math.random()}`,
        isPrincipal: i.InterlocutorCompany?.isPrincipal ?? false,
        isIndependent: i.isIndependent ?? false,
        interlocutorType: i.interlocutorType || 'client potentiel',
      })),
    }));
  }, [interlocutors, setFormData]);

  // Affichage d'une notification en cas de réinitialisation du formulaire
  useEffect(() => {
    const resetFlag = localStorage.getItem('resetFlag');
    if (resetFlag) {
      toast.success('Le formulaire a été réinitialisé');
      localStorage.removeItem('resetFlag');
    }
  }, []);

  // Définir l'unique interlocuteur comme principal si un seul est présent
  useEffect(() => {
    if (formData.interlocutors.length !== 1) return;
    const updated = formData.interlocutors.map((it) => ({
      ...it,
      isPrincipal: true,
    }));
    setFormData((prev) => ({ ...prev, interlocutors: updated }));
  }, [formData.interlocutors.length]);

  // Gestion des changements dans les champs de saisie
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' && value !== '' ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // Gestion des changements sur les boutons radio
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateCompanyFormData(formData)) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    onSubmit(formData);
    resetFormDataLocal();
    toast.success('Formulaire soumis avec succès');
  };

  // Réinitialisation du formulaire et nettoyage du localStorage
  const resetFormDataLocal = () => {
    setFormData(getResetCompanyFormData());
    clearFormLocalStorage(clearProcessedEmails);
  };

  // Réinitialisation complète du formulaire avec rechargement de la page
  const handleReset = () => {
    localStorage.setItem('resetFlag', 'true');
    resetFormDataLocal();
    window.location.reload();
  };

  // Annulation de la simulation en attente
  const handleCancelSimulation = () => {
    if (window.confirm('Voulez-vous vraiment annuler cette simulation ?')) {
      localStorage.removeItem('pendingSimulation');
      toast.success('Simulation annulée');
      window.location.reload();
    }
  };

  // Navigation vers l'ajout d'un nouvel interlocuteur
  const handleAddNewInterlocutor = () => {
    navigate('/interlocuteur/create');
  };

  // Navigation vers la sélection d'un interlocuteur existant
  const handleExistingInterlocutor = () => {
    clearProcessedEmails();
    localStorage.setItem('pendingCompanyForm', JSON.stringify(formData));
    localStorage.setItem('returnPath', location.pathname);
    navigate('/dashboard', { state: { pendingInterlocutorSelection: true, mode: 'interlocutors' } });
  };

  // Suppression d'un interlocuteur en fonction de sa clé unique
  const handleRemoveInterlocutor = (uniqueKey: string) => {
    removeInterlocutor(uniqueKey);
    toast.info('Interlocuteur supprimé');
  };

  // Bascule de l'interlocuteur principal
  const togglePrincipal = async (uniqueKey: string) => {
    const interlocuteur = formData.interlocutors.find(i => i.uniqueKey === uniqueKey);
    
    if (!interlocuteur) {
      toast.error("Interlocuteur non trouvé");
      return;
    }
    
    // Mode création : mise à jour locale
    if (!formData.id) {
      const updated = formData.interlocutors.map(person => ({
        ...person,
        isPrincipal: person.uniqueKey === uniqueKey,
      }));
      setFormData(prev => ({ ...prev, interlocutors: updated }));
      toast.success("Interlocuteur principal mis à jour localement");
      return;
    }
    
    // Mode édition : vérifier l'ID de l'interlocuteur
    if (!interlocuteur.id) {
      toast.error("ID de l'interlocuteur manquant");
      return;
    }
    
    try {
      // Mise à jour optimiste en local
      const updated = formData.interlocutors.map(person => ({
        ...person,
        isPrincipal: person.uniqueKey === uniqueKey,
      }));
      setFormData(prev => ({ ...prev, interlocutors: updated }));
      
      // Appel API pour sauvegarder la modification sur le serveur
      const response = await axiosInstance.put(
        `/assign/companies/${formData.id}/interlocutors/${interlocuteur.id}/principal`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Erreur lors de la mise à jour");
      }
      
      toast.success("Interlocuteur principal mis à jour");
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      toast.error("Impossible de mettre à jour l'interlocuteur principal");
      
      // Restauration de l'état précédent en cas d'erreur
      const previousState = formData.interlocutors.map(person => ({
        ...person,
        isPrincipal: person.isPrincipal,
      }));
      setFormData(prev => ({ ...prev, interlocutors: previousState }));
    }
  };

  // Affichage de la liste des interlocuteurs avec possibilité de définir le principal
  const renderInterlocutorsList = () => (
    <div>
      {formData.interlocutors.map((interlocutor) => (
        <div key={interlocutor.uniqueKey}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ marginRight: '8px' }}>Interlocuteur Principal :</span>
            <StarIcon
              isActive={interlocutor.isPrincipal}
              onClick={() => {
                if (allowPrincipalChange) togglePrincipal(interlocutor.uniqueKey);
              }}
              disabled={!allowPrincipalChange}
              title={
                interlocutor.isPrincipal 
                  ? 'Interlocuteur principal' 
                  : allowPrincipalChange 
                    ? 'Définir comme principal'
                    : 'Modification impossible sur cette page'
              }
            />
          </div>
          <div
            className={`${styles.interlocutorItem} ${isEditMode ? styles.editModeInterlocutorItem : ''}`}
          >
            <div>
              <strong>
                {interlocutor.firstName} {interlocutor.lastName}
              </strong>
              <p>Email: {interlocutor.email}</p>
              {interlocutor.phone && <p>Téléphone: {interlocutor.phone}</p>}
              {interlocutor.position && <p>Position: {interlocutor.position}</p>}
            </div>
            <div className={styles.interlocutorActions}>
              {!isEditMode && (
                <Button
                  variant="danger"
                  text="Supprimer"
                  onClick={() => handleRemoveInterlocutor(interlocutor.uniqueKey)}
                  size="small"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <form className={styles.companyForm} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>{title}</h2>

      {isSimulationPending && (
        <div className={styles.simulationPendingMessage}>
          <div className={styles.simulationPendingContent}>
            <p>Simulation en attente d'assignation à cet établissement.</p>
            <Button
              variant="danger"
              text="Annuler la simulation"
              onClick={handleCancelSimulation}
              size="small"
            />
          </div>
        </div>
      )}

      <div className={styles.formColumns}>
        <div className={styles.formColumn}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.inputLabel}>
              Nom de l'entreprise *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Entrez le nom de l'entreprise"
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="address" className={styles.inputLabel}>
              Adresse *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Entrez l'adresse"
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="city" className={styles.inputLabel}>
              Ville *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Entrez la ville"
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="postalCode" className={styles.inputLabel}>
              Code Postal *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="Entrez le code postal"
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="comments" className={styles.inputLabel}>
              Commentaires
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments || ''}
              onChange={handleInputChange}
              placeholder="Entrez des commentaires"
              className={`${styles.formInput} ${styles.textarea}`}
            />
          </div>
        </div>

        <div className={styles.formColumn}>
          <div className={styles.inputGroup}>
            <span className={styles.inputLabel}>Type d'établissement *</span>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="establishmentType"
                  value="client potentiel"
                  checked={formData.establishmentType === 'client potentiel'}
                  onChange={handleRadioChange}
                  required
                />
                Client potentiel
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="establishmentType"
                  value="client"
                  checked={formData.establishmentType === 'client'}
                  onChange={handleRadioChange}
                />
                Client
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="establishmentType"
                  value="ambassadeur"
                  checked={formData.establishmentType === 'ambassadeur'}
                  onChange={handleRadioChange}
                />
                Ambassadeur
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputLabel}>Type d'organisation *</span>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="organizationType"
                  value="Non spécifique"
                  checked={formData.organizationType === 'Non spécifique'}
                  onChange={handleRadioChange}
                  required
                />
                Non spécifique
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="organizationType"
                  value="collectivité"
                  checked={formData.organizationType === 'collectivité'}
                  onChange={handleRadioChange}
                />
                Collectivité
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="organizationType"
                  value="intercommunalité"
                  checked={formData.organizationType === 'intercommunalité'}
                  onChange={handleRadioChange}
                />
                Intercommunalité
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="organizationType"
                  value="département"
                  checked={formData.organizationType === 'département'}
                  onChange={handleRadioChange}
                />
                Département
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="organizationType"
                  value="région"
                  checked={formData.organizationType === 'région'}
                  onChange={handleRadioChange}
                />
                Région
              </label>
            </div>
          </div>

          <div className={styles.inlineGroup}>
            <label htmlFor="numberOfCanteens" className={styles.inputLabel}>
              Nombre de cantines *
            </label>
            <input
              type="number"
              id="numberOfCanteens"
              name="numberOfCanteens"
              value={formData.numberOfCanteens}
              onChange={handleInputChange}
              className={`${styles.formInput} ${styles.inlineInput}`}
              min="0"
              required
            />
          </div>

          <div className={styles.inlineGroup}>
            <label htmlFor="numberOfCentralKitchens" className={styles.inputLabel}>
              Nombre de cuisines centrales *
            </label>
            <input
              type="number"
              id="numberOfCentralKitchens"
              name="numberOfCentralKitchens"
              value={formData.numberOfCentralKitchens}
              onChange={handleInputChange}
              className={`${styles.formInput} ${styles.inlineInput}`}
              min="0"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputLabel}>Type de fonctionnement *</span>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="typeOfFunctioning"
                  value="autonome"
                  checked={formData.typeOfFunctioning === 'autonome'}
                  onChange={handleRadioChange}
                  required
                />
                Autonome
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="typeOfFunctioning"
                  value="en régie centrale"
                  checked={formData.typeOfFunctioning === 'en régie centrale'}
                  onChange={handleRadioChange}
                />
                En régie centrale
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="typeOfFunctioning"
                  value="délégation"
                  checked={formData.typeOfFunctioning === 'délégation'}
                  onChange={handleRadioChange}
                />
                Délégation
              </label>
            </div>
          </div>
        </div>
      </div>

      <h2 className={styles.formSectionTitle}>Interlocuteurs</h2>
      {formData.interlocutors.length > 0 ? (
        <>
          {renderInterlocutorsList()}
          {!isEditMode && (
            <div className={styles.interlocutorActions}>
              <Button
                type="button"
                variant="add"
                text="Interlocuteur existant"
                onClick={handleExistingInterlocutor}
              />
              <Button
                type="button"
                variant="add"
                text="Ajouter un nouvel interlocuteur"
                onClick={handleAddNewInterlocutor}
              />
            </div>
          )}
        </>
      ) : (
        <div>
          {!isEditMode && (
            <div className={styles.interlocutorActions}>
              <Button
                type="button"
                variant="add"
                text="Interlocuteur existant"
                onClick={handleExistingInterlocutor}
              />
              <Button
                type="button"
                variant="add"
                text="Nouvel interlocuteur"
                onClick={handleAddNewInterlocutor}
              />
            </div>
          )}
          {isEditMode && <p>Pas d'interlocuteur assigné</p>}
        </div>
      )}

      <div className={styles.buttonsContainer}>
        <Button
          type="submit"
          variant="submit"
          text={isEditMode ? 'Sauvegarder' : 'Créer'}
        />
        {!isEditMode && (
          <Button variant="danger" text="Réinitialiser" onClick={handleReset} />
        )}
        <Button variant="secondary" text="Annuler" onClick={onClose} />
      </div>
    </form>
  );
};

export default CompanyForm;
