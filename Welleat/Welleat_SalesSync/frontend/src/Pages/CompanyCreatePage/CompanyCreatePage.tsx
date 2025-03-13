// Dossier : src/Pages/CompanyCreatePage, Fichier : CompanyCreatePage.tsx
// Ce composant gère la création d'un établissement.
// Il affiche un formulaire (via CompanyForm) pour saisir les informations, effectue des validations,
// envoie les données à l'API et gère la simulation en attente si elle existe.

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import GreenBackground from '../../components/GreenBackground/GreenBackground';
import CompanyForm from '../../components/CompanyForm/CompanyForm';
import axiosInstance from '../../api/axiosInstance';
import { CompanyFormContext } from '../../context/CompanyFormContext';

import {
  validateCompanyFormData,
  getResetCompanyFormData,
  clearFormLocalStorage,
} from '../../utils/companyFormUtils';

import { CompanyFormData, PendingSimulation } from '../../types';

const CompanyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useContext(CompanyFormContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSimulationPending, setIsSimulationPending] = useState<boolean>(false);

  // Vérifie s'il existe une simulation en attente dans le localStorage
  useEffect(() => {
    const pendingSimulationStr = localStorage.getItem('pendingSimulation');
    if (pendingSimulationStr) {
      setIsSimulationPending(true);
    }
  }, []);

  /**
   * Fonction de soumission du formulaire de création d'établissement.
   * Effectue les validations nécessaires et envoie le payload à l'API.
   */
  const handleSubmit = async (data: CompanyFormData) => {
    try {
      setLoading(true);

      // Validation des champs obligatoires
      if (!data.name || !data.address || !data.city || !data.postalCode) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Validation du code postal (doit comporter 5 chiffres)
      const postalCodeRegex = /^\d{5}$/;
      if (!postalCodeRegex.test(data.postalCode)) {
        toast.error('Le code postal doit contenir exactement 5 chiffres');
        return;
      }

      // Validation des interlocuteurs (vérifie que chaque interlocuteur possède toutes les données requises)
      if (data.interlocutors?.length > 0) {
        const invalidInterlocutors = data.interlocutors.filter(
          i => !i.firstName || !i.lastName || !i.email || !i.position
        );
        if (invalidInterlocutors.length > 0) {
          toast.error('Certains interlocuteurs ont des données manquantes');
          return;
        }
      }

      // Construction du payload à envoyer à l'API pour créer l'établissement
      const companyPayload = {
        name: data.name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        postalCode: data.postalCode.trim(),
        comments: data.comments?.trim() || '',
        establishment_type: data.establishment_type || 'client potentiel',
        organization_type: data.organization_type || 'Non spécifique',
        number_of_canteens: Number(data.number_of_canteens) || 0,
        number_of_central_kitchens: Number(data.number_of_central_kitchens) || 0,
        type_of_functioning: data.type_of_functioning || 'autonome',
        created_by: 1, // ID du créateur (à adapter selon la logique)
        interlocutors: data.interlocutors?.map(interlocutor => ({
          firstName: interlocutor.firstName,
          lastName: interlocutor.lastName,
          email: interlocutor.email.toLowerCase(),
          phone: interlocutor.phone || '',
          position: interlocutor.position || '',
          comment: interlocutor.comment || '',
          interlocutorType: 'client potentiel',
          isPrincipal: interlocutor.isPrincipal || false,
          isIndependent: false,
          uniqueKey: interlocutor.uniqueKey
        })) || []
      };

      console.log('Payload final:', companyPayload);

      // Appel API pour créer l'établissement
      const response = await axiosInstance.post('/companies', companyPayload);

      if (response.status === 201 && response.data) {
        const newCompany = response.data.company;
        if (!newCompany?.id) {
          throw new Error("L'API n'a pas renvoyé d'ID pour la nouvelle entreprise");
        }
        toast.success('Établissement créé avec succès!');

        // Si une simulation est en attente, l'associer à la nouvelle entreprise
        if (isSimulationPending) {
          await handlePendingSimulation(newCompany.id);
        }

        // Réinitialiser le formulaire et nettoyer le localStorage
        setFormData(getResetCompanyFormData());
        clearFormLocalStorage();
        navigate(`/company/${newCompany.id}`);
      }
    } catch (error: any) {
      console.error('Erreur détaillée:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Erreur lors de la création de l'établissement";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gère l'association d'une simulation en attente à l'établissement nouvellement créé.
   */
  const handlePendingSimulation = async (companyId: number) => {
    try {
      const pendingSimulationStr = localStorage.getItem('pendingSimulation');
      if (!pendingSimulationStr) return;

      const pendingSim: PendingSimulation = JSON.parse(pendingSimulationStr);
      const response = await axiosInstance.post('/simulations', {
        ...pendingSim,
        companyId,
      });

      if (response.status === 201) {
        toast.success('Simulation assignée avec succès!');
        localStorage.removeItem('pendingSimulation');
        setIsSimulationPending(false);
      }
    } catch (error) {
      console.error('Erreur simulation :', error);
      toast.error('Erreur lors de la création de la simulation');
    }
  };

  // Annulation : redirige vers le tableau de bord
  const handleCancel = () => navigate('/dashboard');

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <GreenBackground>
      <CompanyForm
        title="Création de l'établissement"
        onSubmit={handleSubmit}
        onClose={handleCancel}
        isEditMode={false}
        isSimulationPending={isSimulationPending}
        allowPrincipalChange={true} // Autorise la modification de l'interlocuteur principal dès la création
      />
    </GreenBackground>
  );
};

export default CompanyCreatePage;
