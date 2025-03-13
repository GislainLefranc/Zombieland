//// Dossier : src/components/Modal, Fichier : CreateCategoryModal.tsx
// Cette modal permet de créer une nouvelle catégorie d'option ou d'équipement,
// et d'assigner des items (options ou équipements) à cette catégorie après création.

import React, { useState, useEffect, FormEvent } from 'react';
import CreateModal from './CreateModal';
import * as modalStyles from '../../../styles/Modals/Modal.css';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Item {
  id: number;
  name: string;
}

interface CreateCategoryModalProps {
  isOpen: boolean; // Indique si la modal est ouverte
  onClose: () => void; // Fonction pour fermer la modal
  categoryType: 'option' | 'equipment'; // Type de catégorie à créer
  onSuccess: (createdCategory: Category) => void; // Callback en cas de création réussie
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  categoryType,
  onSuccess,
}) => {
  // États pour le nom, la description, la liste d'items disponibles et la sélection d'items
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  // Lors de l'ouverture de la modal, réinitialiser les champs et charger les items
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setSelectedItemIds([]);
      fetchItems();
    }
  }, [isOpen, categoryType]);

  // Fonction pour charger les items depuis le backend en fonction du type de catégorie
  const fetchItems = async () => {
    try {
      const endpoint = categoryType === 'option' ? '/options' : '/equipments';
      const response = await axiosInstance.get(endpoint);
      const dataArray = Array.isArray(response.data?.data)
        ? response.data.data
        : response.data;
      // Formater chaque item pour convertir price_ht et price_ttc en nombres
      const formattedItems = dataArray.map((item: any) => ({
        ...item,
        price_ht: Number(item.price_ht) || 0,
        price_ttc: Number(item.price_ttc) || 0,
      }));
      setItems(formattedItems);
    } catch (error) {
      console.error('Erreur lors de la récupération des items:', error);
      toast.error("Erreur lors de la récupération des items");
    }
  };

  // Permet d'assigner ou désassigner un item dans la sélection
  const handleToggleItem = (itemId: number) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }
    try {
      // Définition de l'endpoint selon le type de catégorie
      const endpoint =
        categoryType === 'option'
          ? '/options/categories'
          : '/equipments/categories';
      const payload = {
        name: name.trim(),
        description: description.trim(),
      };
      // Création de la catégorie via une requête POST
      const createRes = await axiosInstance.post(endpoint, payload);
      const createdCategory: Category = createRes.data;
      toast.success('Catégorie créée avec succès');

      // Pour chaque item sélectionné, on effectue une assignation à la nouvelle catégorie
      if (selectedItemIds.length > 0) {
        for (const itemId of selectedItemIds) {
          try {
            const updateEndpoint =
              categoryType === 'option'
                ? `/options/${itemId}`
                : `/equipments/${itemId}`;
            const updatePayload =
              categoryType === 'option'
                ? { category_id: createdCategory.id }
                : { category: createdCategory.id };
            await axiosInstance.put(updateEndpoint, updatePayload);
          } catch (assignError) {
            console.error('Erreur lors de l’assignation de l’item:', assignError);
            toast.error("Erreur lors de l'assignation d'un item");
          }
        }
        toast.success(`Assignation de ${selectedItemIds.length} item(s) réussie`);
      }
      onSuccess(createdCategory);
      onClose();
    } catch (error: any) {
      console.error('Erreur création catégorie:', error);
      toast.error(
        error.response?.data?.error || 'Erreur lors de la création de la catégorie'
      );
    }
  };

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        categoryType === 'option'
          ? "Créer une catégorie d'option"
          : "Créer une catégorie d'équipement"
      }
      actions={[
        { variant: 'submit', text: 'Créer', onClick: handleSubmit, type: 'submit' },
        { variant: 'cancel', text: 'Annuler', onClick: onClose, type: 'button' },
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={modalStyles.textarea}
          />
        </div>
        {/* Section multi-select pour assigner des items */}
        <div className={modalStyles.formGroup}>
          <label className={modalStyles.label}>
            {categoryType === 'option'
              ? 'Assigner des options à la catégorie'
              : 'Assigner des équipements à la catégorie'}
          </label>
          <div
            style={{
              maxHeight: '150px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '0.5rem',
            }}
          >
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '4px',
                  background: selectedItemIds.includes(it.id) ? '#e0e0e0' : 'transparent',
                  padding: '4px',
                  borderRadius: '4px',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedItemIds.includes(it.id)}
                  onChange={() => handleToggleItem(it.id)}
                  style={{ marginRight: '8px' }}
                />
                <span>{it.name}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </CreateModal>
  );
};

export default CreateCategoryModal;
