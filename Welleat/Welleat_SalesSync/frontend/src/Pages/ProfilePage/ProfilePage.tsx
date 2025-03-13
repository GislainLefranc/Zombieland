/*
  Dossier : src/Pages
  Fichier : ProfilePage.tsx
  Ce composant affiche et permet l'édition du profil utilisateur.
*/

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import * as styles from './ProfilePage.css';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { profileData, isEditing, handleInputChange, toggleEdit, saveProfile } = useProfile();

  const handleSaveAndRefresh = async () => {
    await saveProfile();
    window.location.reload();
  };

  if (loading) return <div>Chargement...</div>;
  if (!user) return <div>Veuillez vous connecter pour accéder à votre profil.</div>;

  return (
    <GreenBackground>
      <div className={styles.profileContent}>
        <h2 className={styles.profileTitle}>Mon Profil</h2>
        <p className={styles.profileSubtitle}>
          Attention ces informations apparaîtront sur les simulations envoyées aux clients.
        </p>

        <div className={styles.profileFields}>
          {Object.entries({
            nom: 'Nom :',
            prenom: 'Prénom :',
            email: 'Email :',
            phone: 'Téléphone :',
            position: 'Poste :',
          }).map(([key, label]) => (
            <InputField
              key={key}
              id={key}
              name={key}
              type={key === 'email' ? 'email' : 'text'}
              label={label}
              value={profileData[key as keyof typeof profileData]}
              onChange={handleInputChange}
              variant="profile"
              readOnly={!isEditing}
            />
          ))}
        </div>

        <div className={styles.actions}>
          {isEditing && (
            <div className={styles.leftAction}>
              <Button text="Sauvegarder" onClick={handleSaveAndRefresh} variant="submit" />
            </div>
          )}
          <div className={styles.rightAction}>
            <Button text={isEditing ? 'Annuler' : 'Éditer'} onClick={toggleEdit} variant={isEditing ? 'cancel' : 'secondary'} />
          </div>
        </div>
      </div>
    </GreenBackground>
  );
};

export default ProfilePage;
