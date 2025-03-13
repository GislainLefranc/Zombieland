// Dossier : src/Pages, Fichier : CategoryPage.tsx
// Ce composant affiche la liste des catégories (d'équipements ou d'options) et gère leur création, modification et suppression.
// Il utilise plusieurs modales pour créer, visualiser et supprimer des catégories.

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/DashboardSearchComponents/DashboardHeader';
import Button from '../../components/Button/Button';
import CategoryTable, { Category } from '../../components/GenericTable/CategoryTable';
import CreateCategoryModal from '../../components/Modal/CreateModal/CreateCategoryModal';
// Modales de visualisation pour catégories d'équipements ou d'options
import ViewCategoryModal from '../../components/Modal/ViewModal/ViewCategoryModal';
import ViewCategoryOptionModal from '../../components/Modal/ViewModal/ViewCategoryOptionModal';
// Modal de confirmation de suppression
import DeleteConfirmationModal from '../../components/Modal/ChoiceModal/DeleteConfirmationModal';
import ViewEquipmentCategoryModal from '@/components/Modal/ViewModal/ViewEquipmentCategoryModal';

const CategoryPage: React.FC = () => {
  // Lecture du paramètre "type" dans l'URL pour déterminer le type de catégorie
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryView = searchParams.get('type');

  // États locaux pour stocker les catégories, le chargement, le terme de recherche et les modales
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Charger les catégories dès que le type est défini
  useEffect(() => {
    if (categoryView) {
      fetchCategories(categoryView);
    }
  }, [categoryView]);

  // Fonction pour récupérer les catégories depuis l'API en fonction du type
  const fetchCategories = async (type: string) => {
    setLoading(true);
    try {
      const endpoint = type === 'equipment' ? '/equipments/categories' : '/options/categories';
      const response = await axiosInstance.get(endpoint);
      // Adaptation de la structure de réponse
      if (response.data && response.data.success) {
        setCategories(response.data.data);
      } else if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        throw new Error('Réponse inattendue pour les catégories');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  // Ouvre la modal de création d'une nouvelle catégorie
  const handleCreateCategory = () => {
    setIsCreateModalOpen(true);
  };

  // Callback appelé lors de la création d'une catégorie pour l'ajouter à la liste
  const handleCategoryCreated = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory]);
  };

  // Gère la modification d'une catégorie (peut déclencher une modal de visualisation)
  const handleEditCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setIsViewModalOpen(true);
  };

  // Ouvre la modal de confirmation de suppression
  const handleDeleteCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setIsDeleteModalOpen(true);
  };

  // Callback pour confirmer la suppression d'une catégorie
  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      const endpoint = categoryView === 'equipment'
        ? `/equipments/categories/${selectedCategory.id}`
        : `/options/categories/${selectedCategory.id}`;
      await axiosInstance.delete(endpoint);
      toast.success('Catégorie supprimée avec succès');
      setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression de la catégorie');
    }
  };

  // Lors du clic sur une ligne, affiche la modal de visualisation/modification
  const handleRowClick = (cat: Category) => {
    setSelectedCategory(cat);
    setIsViewModalOpen(true);
  };

  // Filtre les catégories selon le terme de recherche
  const filteredCategories = categories.filter(cat =>
    (cat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Définition du titre de la page en fonction du type de catégorie
  const pageTitle = categoryView === 'equipment'
    ? "Catégories d'équipements"
    : categoryView === 'option'
      ? "Catégories d'options"
      : "Catégories";

  // Si aucun type n'est spécifié dans l'URL, afficher un message d'erreur
  if (!categoryView) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Erreur : pas de type de catégorie précisé</h2>
        <p>Utilisez ?type=option ou ?type=equipment dans l'URL</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <DashboardHeader
        title={pageTitle}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredCategories.length}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button
          variant="add"
          text="Ajouter une catégorie"
          onClick={handleCreateCategory}
          type="button"
        />
      </div>

      <CategoryTable
        categories={filteredCategories}
        loading={loading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onRowClick={handleRowClick}
      />

      {/* Modal de création de catégorie */}
      {isCreateModalOpen && (
        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          categoryType={categoryView === 'equipment' ? 'equipment' : 'option'}
          onSuccess={handleCategoryCreated}
        />
      )}

      {/* Modal de visualisation pour catégories d'équipements */}
      {isViewModalOpen && selectedCategory && categoryView === 'equipment' && (
        <ViewEquipmentCategoryModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          category={selectedCategory}
          onUpdate={(updatedCat: Category) =>
            setCategories(prev => prev.map(c => (c.id === updatedCat.id ? updatedCat : c)))
          }
        />
      )}

      {/* Modal de visualisation pour catégories d'options */}
      {isViewModalOpen && selectedCategory && categoryView === 'option' && (
        <ViewCategoryOptionModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          category={selectedCategory}
          onUpdate={(updatedCat: Category) =>
            setCategories(prev => prev.map(c => (c.id === updatedCat.id ? updatedCat : c)))
          }
        />
      )}

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && selectedCategory && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setSelectedCategory(null); }}
          onConfirm={confirmDeleteCategory}
          title="Confirmer la suppression"
          message={`Voulez-vous vraiment supprimer la catégorie "${selectedCategory.name}" ?`}
          selectedCompanies={[]}
          selectedInterlocutors={[]}
          selectedUsers={[]}
          viewMode="category"
          isDeleting={false}
        />
      )}
    </div>
  );
};

export default CategoryPage;
