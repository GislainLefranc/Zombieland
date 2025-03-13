//// Dossier : src/components/Modal/ChoiceModal, Fichier : ViewCategoryOptionModal.tsx
// Cette modal est similaire à ViewCategoryModal mais dédiée aux catégories d'option.
// Elle permet de visualiser et de modifier les options assignées à une catégorie d'option.

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

interface ViewCategoryOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onUpdate: (updatedCategory: Category) => void;
}

const ViewCategoryOptionModal: React.FC<ViewCategoryOptionModalProps> = ({
  isOpen,
  onClose,
  category,
  onUpdate,
}) => {
  // États pour les options assignées et disponibles pour la catégorie d'option
  const [assignedOptions, setAssignedOptions] = useState<Option[]>([]);
  const [availableOptions, setAvailableOptions] = useState<Option[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | ''>('');

  // Fonction pour formater un prix
  const formatPrice = (price: string | number): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Charger les options assignées et disponibles à l'ouverture de la modal
  useEffect(() => {
    if (isOpen) {
      fetchAssignedOptions();
      fetchAvailableOptions();
    }
    setSelectedOptionId('');
  }, [isOpen, category]);

  const fetchAssignedOptions = async () => {
    try {
      const response = await axiosInstance.get(`/options?category_id=${category.id}`);
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      if (Array.isArray(data)) {
        // Convertir explicitement les prix en nombre
        const formattedAssignedOptions = data.map((opt: any) => ({
          ...opt,
          price_ht: Number(opt.price_ht || opt.priceHt) || 0,
          price_ttc: Number(opt.price_ttc || opt.priceTtc) || 0,
        }));
        setAssignedOptions(formattedAssignedOptions);
      } else {
        throw new Error("Format de réponse inattendu pour les options assignées");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des options assignées");
    }
  };

  const fetchAvailableOptions = async () => {
    try {
      const response = await axiosInstance.get('/options');
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      if (Array.isArray(data)) {
        // Filtrer pour obtenir les options non assignées à cette catégorie
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

  // Ajout d'une option à la catégorie
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

  // Retrait d'une option de la catégorie
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

  // Soumission du formulaire de modification de la catégorie
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
      title={`Détails de la catégorie d'option : ${category.name}`}
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
      <form onSubmit={handleSubmit} className={modalStyles.form}>
        <div className={modalStyles.formGroup}>
          <label htmlFor="categoryName" className={modalStyles.label}>
            Nom de la catégorie
          </label>
          <input
            id="categoryName"
            type="text"
            value={category.name}
            onChange={(e) => (category.name = e.target.value)}
            required
            placeholder="Nom de la catégorie"
            className={modalStyles.input}
          />
        </div>
        <div className={modalStyles.formGroup}>
          <label htmlFor="categoryDesc" className={modalStyles.label}>
            Description
          </label>
          <textarea
            id="categoryDesc"
            value={category.description || ''}
            onChange={(e) => (category.description = e.target.value)}
            placeholder="Description"
            className={modalStyles.textarea}
          />
        </div>
      </form>

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

      <h3 style={{ marginBottom: '0.5rem' }}>Ajouter un équipement</h3>
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

export default ViewCategoryOptionModal;
