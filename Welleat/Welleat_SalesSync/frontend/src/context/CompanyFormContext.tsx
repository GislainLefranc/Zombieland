//// Dossier : src/context, Fichier : CompanyFormContext.tsx
// Ce contexte gère les données et la logique du formulaire d'établissement.
// Il inclut les données du formulaire, les fonctions de mise à jour et les appels API pour charger ou modifier un établissement.

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
// Importation de l'interface Interlocutor depuis vos types
import { Interlocutor } from '../types/index';

export interface CompanyFormData {
  id?: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  comments?: string;
  establishmentType: 'client potentiel' | 'client' | 'ambassadeur';
  organizationType: 'Non spécifique' | 'collectivité' | 'intercommunalité' | 'département' | 'région';
  numberOfCanteens: number;
  numberOfCentralKitchens: number;
  interlocutors: Interlocutor[];
  typeOfFunctioning: 'autonome' | 'en régie centrale' | 'délégation';
}

interface CompanyFormContextProps {
  formData: CompanyFormData; // Données du formulaire
  setFormData: React.Dispatch<React.SetStateAction<CompanyFormData>>;
  loading: boolean; // Indique si une opération est en cours
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchCompanyData: (companyId: string) => Promise<void>; // Fonction pour charger les données d'un établissement
  updateCompany: (companyId: string, payload: Partial<CompanyFormData>) => Promise<void>; // Mise à jour des données de l'établissement
  deleteInterlocutor: (interlocutorId: number) => Promise<void>; // Suppression d'un interlocuteur
  setPrincipalInterlocutor: (companyId: number, interlocutorId: number) => Promise<void>; // Définit l'interlocuteur principal
}

const defaultFormData: CompanyFormData = {
  name: '',
  address: '',
  city: '',
  postalCode: '',
  comments: '',
  establishmentType: 'client potentiel',
  organizationType: 'Non spécifique',
  numberOfCanteens: 0,
  numberOfCentralKitchens: 0,
  interlocutors: [],
  typeOfFunctioning: 'autonome',
};

export const CompanyFormContext = createContext<CompanyFormContextProps>({
  formData: defaultFormData,
  setFormData: () => {},
  loading: false,
  setLoading: () => {},
  fetchCompanyData: async () => {},
  updateCompany: async () => {},
  deleteInterlocutor: async () => {},
  setPrincipalInterlocutor: async () => {},
});

export const useCompanyForm = () => {
  const context = useContext(CompanyFormContext);
  if (!context) {
    throw new Error("useCompanyForm doit être utilisé à l'intérieur d'un CompanyFormProvider");
  }
  return context;
};

export const CompanyFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Charge les données du formulaire depuis localStorage au démarrage
  const [formData, setFormData] = useState<CompanyFormData>(() => {
    const saved = localStorage.getItem('companyFormData');
    return saved ? JSON.parse(saved) : defaultFormData;
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Sauvegarde les données du formulaire dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('companyFormData', JSON.stringify(formData));
  }, [formData]);

  // Fonction asynchrone pour charger les données d'un établissement via l'API
  const fetchCompanyData = async (companyId: string) => {
    setLoading(true);
    try {
      console.log('fetchCompanyData - Début', companyId);
      const response = await axiosInstance.get(`/companies/${companyId}`);
      const data = response.data;
      const editedFormData: CompanyFormData = {
        id: data.id,
        name: data.name,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        comments: data.comments || '',
        establishmentType: data.establishmentType,
        organizationType: data.organizationType,
        numberOfCanteens: data.numberOfCanteens,
        numberOfCentralKitchens: data.numberOfCentralKitchens,
        typeOfFunctioning: data.functionings?.length > 0 ? data.functionings[0].typeOfFunctioning : 'autonome',
        interlocutors: data.interlocutors.map((i: any) => ({
          ...i,
          id: i.id,
          firstName: i.firstName || '',
          lastName: i.lastName || '',
          uniqueKey: i.id ? i.id.toString() : Date.now().toString(),
          email: i.email,
          phone: i.phone || '',
          position: i.position || '',
          comment: i.comment || '',
          interlocutorType: i.interlocutorType || 'client potentiel',
          isPrincipal: i.isPrincipal || false,
          isIndependent: i.isIndependent || false,
        })),
      };
      setFormData(editedFormData);
      console.log('fetchCompanyData - setFormData', editedFormData);
    } catch (error: any) {
      console.error('Erreur fetchCompanyData:', error);
      toast.error("Impossible de charger les données de l'établissement.");
    } finally {
      setLoading(false);
      console.log('fetchCompanyData - Fin');
    }
  };

  // Met à jour l'établissement via l'API et met à jour localement le contexte
  const updateCompany = async (companyId: string, payload: Partial<CompanyFormData>) => {
    try {
      console.log('updateCompany - Début', companyId, payload);
      let filteredPayload = { ...payload };
      if (payload.interlocutors && Array.isArray(payload.interlocutors)) {
        const validInterlocutors = payload.interlocutors.filter(i => i.id);
        filteredPayload.interlocutors = validInterlocutors;
      }
      await axiosInstance.put(`/companies/${companyId}`, filteredPayload);
      setFormData(prev => ({ ...prev, ...filteredPayload }));
      toast.success('Établissement mis à jour avec succès!');
      console.log('updateCompany - Fin');
    } catch (error: any) {
      console.error('Erreur updateCompany:', error);
      toast.error(`Une erreur est survenue lors de la mise à jour de l'établissement: ${error.message}`);
    }
  };

  // Supprime un interlocuteur via l'API et met à jour le contexte
  const deleteInterlocutor = async (interlocutorId: number) => {
    try {
      console.log('deleteInterlocutor - Début', interlocutorId);
      await axiosInstance.delete(`/interlocutors/${interlocutorId}`);
      setFormData(prev => ({
        ...prev,
        interlocutors: prev.interlocutors.filter(i => i.id !== interlocutorId),
      }));
      toast.success('Interlocuteur supprimé avec succès !');
      console.log('deleteInterlocutor - Fin');
    } catch (error: any) {
      console.error('Erreur deleteInterlocutor:', error);
      toast.error('Une erreur est survenue lors de la suppression.');
    }
  };

  // Définit l'interlocuteur principal en appelant l'API et en rechargeant les données de l'établissement
  const setPrincipalInterlocutor = async (companyId: number, interlocutorId: number) => {
    console.log('setPrincipalInterlocutor - Début', companyId, interlocutorId);
    try {
      console.log("setPrincipalInterlocutor - Appel de l'API");
      await axiosInstance.put(`/assign/set-principal-interlocutor/${companyId}/${interlocutorId}`);
      console.log('setPrincipalInterlocutor - Appel de fetchCompanyData');
      await fetchCompanyData(companyId.toString());
      toast.success('Interlocuteur principal mis à jour avec succès!');
      console.log('setPrincipalInterlocutor - Fin avec succès');
    } catch (error) {
      console.error('setPrincipalInterlocutor - Erreur:', error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'interlocuteur principal.");
    }
  };

  return (
    <CompanyFormContext.Provider
      value={{
        formData,
        setFormData,
        loading,
        setLoading,
        fetchCompanyData,
        updateCompany,
        deleteInterlocutor,
        setPrincipalInterlocutor,
      }}
    >
      {children}
    </CompanyFormContext.Provider>
  );
};
