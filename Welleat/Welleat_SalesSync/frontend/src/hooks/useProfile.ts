// Dossier : src/hooks, Fichier : useProfile.ts
// Ce hook permet de gérer le profil utilisateur.
// Il initialise le profil à partir des données de l'utilisateur récupérées et permet de modifier le profil.

import { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from './useAuth';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import type { User } from '../types';

interface ProfileData {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  position: string;
}

interface UpdatedUserData {
  lastName: string;
  firstName: string;
  email: string;
  phone: string | null;
  position: string | null;
}

/**
 * Hook personnalisé pour gérer le profil utilisateur.
 */
export const useProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    position: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        nom: user.lastName,
        prenom: user.firstName,
        email: user.email,
        phone: user.phone || '',
        position: user.position || '',
      });
    }
  }, [user]);

  /**
   * Gère les changements dans le formulaire de profil.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Bascule le mode édition du profil.
   */
  const toggleEdit = () => {
    setIsEditing(prev => !prev);
  };

  /**
   * Enregistre les modifications du profil en les envoyant au serveur.
   */
  const saveProfile = async () => {
    try {
      const updatedUser: UpdatedUserData = {
        lastName: profileData.nom,
        firstName: profileData.prenom,
        email: profileData.email,
        phone: profileData.phone || null,
        position: profileData.position || null,
      };

      console.log('Données envoyées au serveur:', updatedUser);

      const { data } = await axiosInstance.put('/users/me', updatedUser);
      console.log('Réponse du serveur:', data);

      setUser(data);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès !');

      setProfileData({
        nom: data.lastName,
        prenom: data.firstName,
        email: data.email,
        phone: data.phone || '',
        position: data.position || '',
      });
    } catch (error: any) {
      console.error('Erreur détaillée:', error.response?.data);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  return {
    profileData,
    isEditing,
    handleInputChange,
    toggleEdit,
    saveProfile,
  };
};
