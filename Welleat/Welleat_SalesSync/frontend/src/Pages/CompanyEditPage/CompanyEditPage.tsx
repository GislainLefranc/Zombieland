// Dossier : src/Pages/CompanyEditPage, Fichier : CompanyEditPage.tsx
// Ce composant gère l'édition d'un établissement existant.
// Il charge les données de l'établissement via l'API, les stocke dans le contexte et gère la soumission des modifications.

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import GreenBackground from '../../components/GreenBackground/GreenBackground';
import CompanyForm from '../../components/CompanyForm/CompanyForm';
import axiosInstance from '../../api/axiosInstance';

import { CompanyFormContext } from '../../context/CompanyFormContext';
import { CompanyFormData } from '../../types/companyInterlocutorTypes';

// Import des helpers pour la validation et la réinitialisation du formulaire
import {
  validateCompanyFormData,
  getResetCompanyFormData,
  clearFormLocalStorage,
} from '../../utils/companyFormUtils';

const CompanyEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Récupère l'ID de l'établissement depuis l'URL
  const navigate = useNavigate();
  const { formData, setFormData } = useContext(CompanyFormContext);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Au montage, charge les données de l'établissement via l'API.
   * En cas d'erreur ou d'absence d'ID, redirige vers le tableau de bord.
   */
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (!id) {
          toast.error("L'identifiant de l'établissement est manquant.");
          navigate('/dashboard');
          return;
        }
        const response = await axiosInstance.get(`/companies/${id}`);
        if (!response.data) {
          toast.error("Données de l'établissement introuvables.");
          navigate('/dashboard');
          return;
        }
        const data = response.data;
        // Transformation de la réponse en formData compatible avec CompanyForm
        const editedFormData: CompanyFormData = {
          id: parseInt(id as string),
          name: data.name,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          comments: data.comments || '',
          establishmentType: data.establishmentType,
          organizationType: data.organizationType,
          numberOfCanteens: data.numberOfCanteens,
          numberOfCentralKitchens: data.numberOfCentralKitchens,
          typeOfFunctioning:
            data.functionings?.length > 0
              ? data.functionings[0].typeOfFunctioning
              : 'autonome',
          interlocutors: data.interlocutors.map((i: any) => ({
            ...i,
            id: i.id,
            firstName: i.firstName || '',
            lastName: i.lastName || '',
            uniqueKey: i.id ? i.id.toString() : Date.now().toString(),
            isPrincipal: i.InterlocutorCompany?.isPrincipal || false
          }))
        };
        console.log('Données éditées:', editedFormData);
        setFormData(editedFormData);
        setLoading(false);
      } catch (error) {
        toast.error("Erreur lors de la récupération des données de l'établissement.");
        navigate('/dashboard');
      }
    };

    fetchCompanyData();
  }, [id, navigate, setFormData]);

  /**
   * Gère la soumission du formulaire en mode édition.
   * Envoie les données modifiées à l'API pour mettre à jour l'établissement.
   */
  const handleSubmit = async (data: CompanyFormData) => {
    try {
      setLoading(true);
      if (!id || !validateCompanyFormData(data)) {
        toast.error('Formulaire invalide ou ID manquant');
        return;
      }

      // Prépare le payload en s'assurant que les interlocuteurs contiennent bien l'ID
      let companyPayload = {
        ...data,
        id: parseInt(id),
        interlocutors: data.interlocutors?.map((i) => ({
          ...i,
          id: i.id,
          isPrincipal: i.isPrincipal === true
        }))
      };

      const response = await axiosInstance.put(`/companies/${id}`, companyPayload);
      if (response.status === 200 && response.data?.company?.id) {
        const updatedCompany = response.data.company;
        toast.success('Établissement modifié avec succès !');
        navigate(`/company/${updatedCompany.id}`);
      } else {
        toast.error("Impossible de mettre à jour l'établissement (ID manquant)");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erreur lors de l'édition de l'établissement."
      );
    } finally {
      setLoading(false);
    }
  };

  // Annule l'édition et revient à la page de l'établissement
  const handleCancel = () => {
    navigate(`/company/${id}`);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <GreenBackground>
      <CompanyForm
        title="Modification de l'établissement"
        onSubmit={handleSubmit}
        onClose={handleCancel}
        isEditMode={true}
        allowPrincipalChange={true} // Autorise la modification de l'interlocuteur principal
      />
    </GreenBackground>
  );
};

export default CompanyEditPage;
