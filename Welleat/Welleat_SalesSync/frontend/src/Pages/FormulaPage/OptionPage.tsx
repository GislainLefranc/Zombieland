// Dossier : src/Pages | Fichier : OptionPage.tsx

import React, { useState, useEffect } from 'react';
import { useOptions } from '../../hooks/useOptions';
import OptionTable from '../../components/GenericTable/OptionTable';
import DashboardHeader from '../../components/DashboardSearchComponents/DashboardHeader';
import * as sharedStyles from '../../styles/PagesStyles/SharedPage.css';
import type { Option } from '../../types';
import DeleteConfirmationModal from '../../components/Modal/ChoiceModal/DeleteConfirmationModal';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

const OptionPage: React.FC = () => {
  const { options, loading, error, fetchOptions } = useOptions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!options.length) {
      fetchOptions();
    }
  }, [fetchOptions, options.length]);

  const handleEdit = (option: Option) => {
    setSelectedOption(option);
    setIsModalOpen(true);
  };

  const handleDelete = (option: Option) => {
    setSelectedOption(option);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedOption) return;
    try {
      const response = await axiosInstance.delete(`/options/${selectedOption.id}`);
      if (response.status === 200) {
        toast.success('Option supprimée avec succès');
        await fetchOptions();
        setIsDeleteModalOpen(false);
        setSelectedOption(null);
      }
    } catch (error: any) {
      console.error('Détails erreur :', error.response?.data);
      toast.error(
        error.response?.data?.error || 'Erreur lors de la suppression'
      );
    }
  };

  return (
    <div className={sharedStyles.mainContainer}>
      <DashboardHeader 
        title="Options"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={options.length}
        onAdd={() => setIsModalOpen(true)}
      />
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div>Erreur : {error}</div>
      ) : (
        <>
          <div className={sharedStyles.header}>
            <div className={sharedStyles.actionButtonsContainer}>
              {/* Boutons supplémentaires si nécessaire */}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Button
                variant="toggle"
                text="Gérer les catégories"
                onClick={() => navigate('/categories?type=option')}
                type="button"
              />
            </div>
          </div>
          <OptionTable
            options={options}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'option"
        message={`Voulez-vous vraiment supprimer l'option "${selectedOption?.name}" ?`}
        selectedCompanies={[]}
        selectedInterlocutors={[]}
        selectedUsers={[]}
        viewMode="options"
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default OptionPage;
