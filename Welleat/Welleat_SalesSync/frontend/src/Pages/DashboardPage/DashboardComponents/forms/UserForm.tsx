// Dossier : src/components/DashboardComponents/modals/forms
// Fichier : UserForm.tsx
// Ce composant affiche un formulaire de création d'un membre de l'équipe Welleat.
// Il permet de saisir les informations du nouvel utilisateur et de les envoyer au backend.

import React, { useState } from 'react';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'react-toastify';
import * as styles from '../styles/Forms.css';
import Button from '../../../../components/Button/Button';

interface UserFormProps {
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onClose }) => {
  // États locaux pour stocker les données du formulaire
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Fonction de soumission qui envoie les données à l'API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/users', {
        firstName,
        lastName,
        email,
        password,
      });
      toast.success("Membre de l'équipe Welleat créé avec succès");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la création du membre');
    }
  };

  return (
    <form>
      <div>
        <h3>Créer un Membre Welleat</h3>
      </div>
      <div>
        <label>
          Prénom:
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Nom:
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Mot de passe:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <Button
          variant="cancel"
          text="Annuler"
          onClick={onClose}
        />
        <Button
          variant="submit"
          text="Créer"
          type="submit"
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
};

export default UserForm;
