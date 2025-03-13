//// Dossier : src/components/Modal, Fichier : CreateEntityModal.tsx
// Cette modal permet de créer une entité (entreprise, interlocuteur ou membre Welleat)
// en affichant le formulaire correspondant selon le mode sélectionné.

import React from 'react';
import CreateModal from './CreateModal';
import CompanyForm from '../../CompanyForm/CompanyForm';
import InterlocutorForm from '../../../Pages/DashboardPage/DashboardComponents/forms/InterlocutorForm';
import UserForm from '../../../Pages/DashboardPage/DashboardComponents/forms/UserForm';

interface CreateEntityModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  viewMode: string; // Détermine le type d'entité à créer
  title: string; // Titre affiché dans la modal
}

const CreateEntityModal: React.FC<CreateEntityModalProps> = ({
  isOpen,
  onClose,
  viewMode,
  title,
}) => {
  // Fonction qui retourne le formulaire approprié en fonction du mode
  const renderForm = () => {
    switch (viewMode) {
      case 'companies':
        return (
          <CompanyForm
            title="Nouvelle entreprise"
            onSubmit={() => {
              onClose();
            }}
            onClose={onClose}
          />
        );
      case 'interlocutors':
      case 'independentInterlocutors':
        return <InterlocutorForm onClose={onClose} />;
      case 'welleatMembers':
        return <UserForm onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={[
        {
          variant: 'cancel',
          text: 'Annuler',
          onClick: onClose,
          type: 'button',
        },
      ]}
    >
      {renderForm()}
    </CreateModal>
  );
};

export default CreateEntityModal;
