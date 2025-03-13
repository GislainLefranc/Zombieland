// Dossier : src/Pages | Fichier : FormulaPage.tsx

import React, { useState } from 'react';
import useFormulas from '../../hooks/useFormulas';
import FormulaTable from '../../components/GenericTable/FormulaTable';
import OptionTable from '../../components/GenericTable/OptionTable';
import * as sharedStyles from '../../styles/PagesStyles/SharedPage.css';
import Button from '../../components/Button/Button';
import CreateFormulaModal from '../../components/Modal/CreateModal/CreateFormulaModal';
import CreateOptionModal from '../../components/Modal/CreateModal/CreateOptionsModal';
import DeleteConfirmationModal from '../../components/Modal/ChoiceModal/DeleteConfirmationModal';
import { Formula, Option } from '../../types';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import Pagination from '../../components/DashboardSearchComponents/Pagination';
import DashboardHeader from '../../components/DashboardSearchComponents/DashboardHeader';
import { useNavigate } from 'react-router-dom';

const FormulaPage: React.FC = () => {
  // Récupération des formules via le hook personnalisé
  const { formulas, loading, error, fetchFormulas } = useFormulas();

  // États pour gérer les options et la sélection d'élément
  const [options, setOptions] = useState<Option[]>([]);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Formula | Option | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [view, setView] = useState<'formulas' | 'options'>('formulas');
  const navigate = useNavigate();

  // Récupération des options depuis l'API
  const fetchOptions = async () => {
    setOptionsLoading(true);
    setOptionsError(null);
    try {
      const response = await axiosInstance.get('/options');
      const optionsData = response.data.data || [];
      const formattedOptions: Option[] = optionsData.map((option: any) => ({
        ...option,
        price_ht: Number(option.price_ht || option.priceHt) || 0,
        price_ttc: Number(option.price_ttc || option.priceTtc) || 0,
      }));
      setOptions(formattedOptions);
    } catch (error: any) {
      console.error('Erreur lors du chargement des options :', error);
      setOptionsError('Erreur lors du chargement des options.');
      toast.error('Erreur lors du chargement des options.');
    } finally {
      setOptionsLoading(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  // Basculement entre formules et options
  const handleToggleView = () => {
    const newView = view === 'formulas' ? 'options' : 'formulas';
    setView(newView);
    setSearchTerm('');
    setCurrentPage(1);
    if (newView === 'options') {
      fetchOptions();
    }
  };

  // Ouverture de la modale pour création ou modification
  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenModal = (item?: Formula | Option) => {
    setSelectedItem(item || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  // Gestion de la suppression d'un élément
  const handleDelete = (item: Formula | Option) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      const endpoint =
        view === 'formulas'
          ? `/formulas/${selectedItem.id}`
          : `/options/${selectedItem.id}`;
      const response = await axiosInstance.delete(endpoint);
      if (response.data?.success) {
        toast.success(
          `${view === 'formulas' ? 'Formule' : 'Option'} supprimée avec succès`
        );
        if (view === 'formulas') {
          await fetchFormulas();
        } else {
          await fetchOptions();
        }
      } else {
        throw new Error('Erreur lors de la suppression');
      }
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error: any) {
      console.error('Erreur de suppression :', error);
      toast.error(
        error.response?.data?.error || 'Erreur lors de la suppression'
      );
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  // Actualiser les formules
  const refreshFormulas = async () => {
    await fetchFormulas();
  };

  // Filtrage des éléments selon la recherche
  const filteredItems = view === 'formulas'
    ? formulas.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : options.filter(o =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.description && o.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        o.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const isLoading = view === 'formulas' ? loading : optionsLoading;

  return (
    <div className={sharedStyles.mainContainer}>
      <DashboardHeader
        title={view === 'formulas' ? 'Formules' : 'Options'}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredItems.length}
        onAdd={handleAddItem}
      />

      <div className={sharedStyles.header}>
        <div className={sharedStyles.actionButtonsContainer}>
          <Button
            variant="add"
            text={view === 'formulas' ? 'Créer une Formule' : 'Créer une Option'}
            onClick={handleAddItem}
            type="button"
          />
          <Button
            variant="toggle"
            text={`Voir ${view === 'formules' ? 'les Options' : 'les Formules'}`}
            onClick={handleToggleView}
            type="button"
          />
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

      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <>
          {view === 'formulas' ? (
            <FormulaTable
              formulas={currentItems as Formula[]}
              loading={loading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ) : (
            <OptionTable
              options={currentItems as Option[]}
              loading={optionsLoading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          />
        </>
      )}

      {/* Modale pour création/mise à jour d'une formule */}
      {isModalOpen && view === 'formulas' && (
        <CreateFormulaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={refreshFormulas}
          formula={selectedItem as Formula | null}
        />
      )}

      {/* Modale pour création/mise à jour d'une option */}
      {isModalOpen && view === 'options' && (
        <CreateOptionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onOptionCreated={fetchOptions}
          option={selectedItem as Option | null}
        />
      )}

      {/* Modale de confirmation de suppression */}
      {isDeleteModalOpen && selectedItem && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
          message={`Êtes-vous sûr de vouloir supprimer "${selectedItem.name}" ?`}
        />
      )}
    </div>
  );
};

export default FormulaPage;
