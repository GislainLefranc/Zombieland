//// Dossier : src/components/Modal/ChoiceModal/Mailing, Fichier : ViewCategoryModal.tsx
// Cette modal permet de visualiser les détails d'une catégorie (options ou équipements) et de gérer
// l'assignation ou le retrait d'options pour une catégorie d'option.

import React, { useState, useEffect, FormEvent } from 'react';
import CreateModal from '../CreateModal/CreateModal';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import Button from '../../Button/Button';
import * as modalStyles from '../../../styles/Modals/Modal.css';

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_default?: boolean;
}

export interface Option {
  id: number;
  name: string;
  price_ht: string | number;
  category_id: number | null;
}

interface ViewCategoryModalProps {
  isOpen: boolean;             // Indique si la modal est ouverte
  onClose: () => void;         // Fonction pour fermer la modal
  category: Category;          // Catégorie à afficher
  categoryType: 'equipment' | 'option'; // Type de catégorie
  onUpdate: (updatedCategory: Category) => void; // Callback après mise à jour
}

const ViewCategoryModal: React.FC<ViewCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  categoryType,
  onUpdate,
}) => {
  // États pour les options assignées et disponibles (uniquement pour le type "option")
  const [assignedOptions, setAssignedOptions] = useState<Option[]>([]);
  const [availableOptions, setAvailableOptions] = useState<Option[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | ''>('');

  // Fonction utilitaire pour formater un prix
  const formatPrice = (price: string | number): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // À chaque ouverture de la modal, charger les options assignées et disponibles
  useEffect(() => {
    if (isOpen && categoryType === 'option') {
      fetchAssignedOptions();
      fetchAvailableOptions();
    }
    setSelectedOptionId('');
  }, [isOpen, category, categoryType]);

  // Charger les options déjà assignées à la catégorie via l'API
  const fetchAssignedOptions = async () => {
    try {
      const response = await axiosInstance.get(`/options?category_id=${category.id}`);
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      if (Array.isArray(data)) {
        setAssignedOptions(data);
      } else {
        throw new Error("Format de réponse inattendu pour les options assignées");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des options assignées");
    }
  };

  // Charger toutes les options disponibles, puis filtrer celles déjà assignées à la catégorie
  const fetchAvailableOptions = async () => {
    try {
      const response = await axiosInstance.get('/options');
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      if (Array.isArray(data)) {
        // Filtrer pour obtenir uniquement les options dont le category_id diffère de la catégorie actuelle
        const available = data.filter((opt: Option) => opt.category_id !== category.id);
        setAvailableOptions(available);
      } else {
        throw new Error("Format de réponse inattendu pour les options disponibles");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des options disponibles");
    }
  };

  // Fonction d'ajout d'une option à la catégorie
  const handleAddOption = async () => {
    if (!selectedOptionId) {
      toast.info("Veuillez sélectionner une option à ajouter");
      return;
    }
    try {
      await axiosInstance.put(`/options/${selectedOptionId}`, {
        category_id: category.id,
      });
      toast.success("Option ajoutée à la catégorie");
      setSelectedOptionId('');
      fetchAssignedOptions();
      fetchAvailableOptions();
      onUpdate(category);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Erreur lors de l'ajout de l'option");
    }
  };

  // Fonction de retrait d'une option de la catégorie
  const handleRemoveOption = async (optionId: number) => {
    try {
      await axiosInstance.put(`/options/${optionId}`, {
        category_id: null,
      });
      toast.success("Option retirée de la catégorie");
      fetchAssignedOptions();
      fetchAvailableOptions();
      onUpdate(category);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Erreur lors du retrait de l'option");
    }
  };

  // Soumission du formulaire pour modifier la catégorie (nom/description)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name: category.name, description: category.description };
      const response = await axiosInstance.put(`/options/categories/${category.id}`, payload);
      const updatedCategory = response.data.data || response.data;
      toast.success("Catégorie modifiée avec succès");
      onUpdate(updatedCategory);
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de la modification de la catégorie :", error);
      toast.error(error.response?.data?.error || "Erreur lors de la modification de la catégorie");
    }
  };

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Détails de la catégorie : ${category.name}`}
      actions={[
        {
          variant: 'submit',
          text: 'Modifier',
          onClick: handleSubmit,
          type: 'button',
        },
        {
          variant: 'secondary',
          text: 'Retour',
          onClick: onClose,
          type: 'button',
        },
      ]}
    >
      {/* Formulaire d'affichage (lecture seule) de la catégorie */}
      <form onSubmit={handleSubmit} className={modalStyles.form}>
        <div className={modalStyles.formGroup}>
          <label htmlFor="categoryName" className={modalStyles.label}>Nom</label>
          <input
            id="categoryName"
            type="text"
            value={category.name}
            disabled
            className={modalStyles.input}
          />
        </div>
        <div className={modalStyles.formGroup}>
          <label htmlFor="categoryDesc" className={modalStyles.label}>Description</label>
          <textarea
            id="categoryDesc"
            value={category.description || ''}
            disabled
            className={modalStyles.textarea}
          />
        </div>
      </form>

      {/* Affichage des options assignées à la catégorie */}
      <h3 style={{ marginBottom: '0.5rem' }}>Options assignées</h3>
      {assignedOptions.length === 0 ? (
        <p>Aucune option assignée à cette catégorie.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {assignedOptions.map(opt => (
            <li key={opt.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              borderBottom: '1px solid #eee',
            }}>
              <span>{opt.name} ({formatPrice(opt.price_ht)})</span>
              <Button
                variant="danger"
                size="small"
                text="Retirer"
                onClick={() => handleRemoveOption(opt.id)}
                type="button"
              />
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: '1rem 0' }} />

      {/* Section pour ajouter une option à la catégorie */}
      <h3 style={{ marginBottom: '0.5rem' }}>Ajouter une option</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select
          value={selectedOptionId}
          onChange={(e) => setSelectedOptionId(Number(e.target.value))}
          style={{ padding: '8px', flex: 1 }}
        >
          <option value="">-- Sélectionner une option --</option>
          {availableOptions.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.name} ({formatPrice(opt.price_ht)} HT)
            </option>
          ))}
        </select>
        <Button
          variant="add"
          text="Ajouter"
          onClick={handleAddOption}
          type="button"
          size="small"
        />
      </div>
    </CreateModal>
  );
};

export default ViewCategoryModal;
