//// Dossier : src/components/Modal/CreateModal, Fichier : CreateUserModal.tsx
// Ce composant affiche un formulaire dans une modal permettant de créer un compte utilisateur.
// Il inclut les champs essentiels et envoie une requête POST au backend.

import React, { useState } from 'react';
import CreateModal from './CreateModal';
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/axiosInstance';
import Button from '../../Button/Button';
import * as modalStyles from '../../../styles/Modals/Modal.css';

interface CreateUserModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  onUserCreated: () => void; // Callback après création réussie
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
}) => {
  // États pour chaque champ du formulaire utilisateur
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [roleId, setRoleId] = useState(2); 
  const [loading, setLoading] = useState(false);

  // Fonction pour créer l'utilisateur en appelant l'API
  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const defaultPassword = 'ChangeMe123!';
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        position,
        password: defaultPassword,
        roleId,
      };
      await axiosInstance.post('/users/create', payload);
      toast.success('Utilisateur créé avec succès !');
      onClose();
      onUserCreated();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.error ||
          "Erreur lors de la création de l'utilisateur"
      );
    } finally {
      setLoading(false);
    }
  };

  // Contenu du formulaire utilisateur
  const formContent = (
    <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }} className={modalStyles.form}>
      <div className={modalStyles.formGroup}>
        <label htmlFor="firstName" className={modalStyles.hiddenLabel}>
          Prénom
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="Prénom"
          className={modalStyles.input}
        />
      </div>
      <div className={modalStyles.formGroup}>
        <label htmlFor="lastName" className={modalStyles.hiddenLabel}>
          Nom
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Nom"
          className={modalStyles.input}
        />
      </div>
      <div className={modalStyles.formGroup}>
        <label htmlFor="email" className={modalStyles.hiddenLabel}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className={modalStyles.input}
        />
      </div>
      <div className={modalStyles.formGroup}>
        <label htmlFor="phone" className={modalStyles.hiddenLabel}>
          Téléphone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Téléphone"
          className={modalStyles.input}
        />
      </div>
      <div className={modalStyles.formGroup}>
        <label htmlFor="position" className={modalStyles.hiddenLabel}>
          Poste
        </label>
        <input
          id="position"
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Poste"
          className={modalStyles.input}
        />
      </div>
      <div className={modalStyles.formGroup}>
        <label htmlFor="role" className={modalStyles.hiddenLabel}>
          Rôle
        </label>
        <select
          id="role"
          value={roleId}
          onChange={(e) => setRoleId(parseInt(e.target.value))}
          className={modalStyles.select}
        >
          <option value={1}>Administrateur</option>
          <option value={2}>Commercial</option>
        </select>
      </div>
    </form>
  );

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un compte Welleat"
      actions={[
        {
          variant: 'cancel',
          text: 'Annuler',
          onClick: onClose,
          type: 'button',
        },
        {
          variant: 'submit',
          text: loading ? 'Création...' : 'Créer',
          onClick: handleCreateUser,
          disabled: loading,
          type: 'submit',
        },
      ]}
    >
      {formContent}
    </CreateModal>
  );
};

export default CreateUserModal;
