//// Dossier : src/components/Modal/ChoiceModal, Fichier : ViewEquipmentCategoryModal.tsx
// Cette modal permet de visualiser et modifier une catégorie d'équipement,
// en affichant les équipements assignés et disponibles, et en gérant leur assignation.

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

export interface Equipment {
  id: number;
  name: string;
  price_ht: number;
  description?: string;
  category_id?: number | null;
}

interface ViewEquipmentCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onUpdate: (updatedCategory: Category) => void;
}

const ViewEquipmentCategoryModal: React.FC<ViewEquipmentCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onUpdate,
}) => {
  // États pour les champs de la catégorie et la gestion des équipements assignés/disponibles
  const [catName, setCatName] = useState(category.name);
  const [catDescription, setCatDescription] = useState(category.description || '');
  const [assignedEquipments, setAssignedEquipments] = useState<Equipment[]>([]);
  const [availableEquipments, setAvailableEquipments] = useState<Equipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | ''>('');

  // Formatage du prix
  const formatPrice = (price: number): string => price.toFixed(2);

  // Charger les équipements assignés et disponibles lors de l'ouverture de la modal
  useEffect(() => {
    if (isOpen) {
      fetchAssignedEquipments();
      fetchAvailableEquipments();
      setCatName(category.name);
      setCatDescription(category.description || '');
    }
    setSelectedEquipmentId('');
  }, [isOpen, category]);

  // Charger les équipements dont la catégorie correspond à la catégorie actuelle
  const fetchAssignedEquipments = async () => {
    try {
      const response = await axiosInstance.get('/equipments', {
        params: { category_id: category.id, timestamp: Date.now() },
      });
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        const formatted = data
          .filter(eq => eq.category?.id === category.id)
          .map(eq => ({
            id: eq.id,
            name: eq.name,
            description: eq.description,
            price_ht: Number(eq.price_ht || eq.priceHt),
            category_id: eq.category?.id !== null ? Number(eq.category?.id) : null,
          }));
        setAssignedEquipments(formatted);
      }
    } catch (error) {
      console.error('Erreur fetchAssignedEquipments:', error);
      toast.error("Erreur lors du chargement des équipements assignés");
    }
  };

  // Charger les équipements disponibles dont la catégorie n'est pas la catégorie actuelle
  const fetchAvailableEquipments = async () => {
    try {
      const response = await axiosInstance.get('/equipments', {
        params: { timestamp: Date.now() },
      });
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        const formatted = data
          .filter(eq => eq.category?.id !== category.id)
          .map(eq => ({
            id: eq.id,
            name: eq.name,
            description: eq.description,
            price_ht: Number(eq.price_ht || eq.priceHt),
            category_id: eq.category?.id !== null ? Number(eq.category?.id) : null,
          }));
        setAvailableEquipments(formatted);
      }
    } catch (error) {
      console.error('Erreur fetchAvailableEquipments:', error);
      toast.error("Erreur lors du chargement des équipements disponibles");
    }
  };

  // Ajout d'un équipement à la catégorie
  const handleAddEquipment = async () => {
    if (!selectedEquipmentId) {
      toast.info("Veuillez sélectionner un équipement à ajouter");
      return;
    }
    try {
      await axiosInstance.put(`/equipments/${selectedEquipmentId}`, {
        category_id: category.id,
      });
      // Délai pour laisser le temps à la BDD de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 500));
      await Promise.all([fetchAssignedEquipments(), fetchAvailableEquipments()]);
      setSelectedEquipmentId('');
      toast.success("Équipement ajouté avec succès");
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error("Erreur lors de l'ajout de l'équipement");
    }
  };

  // Retrait d'un équipement de la catégorie
  const handleRemoveEquipment = async (equipmentId: number) => {
    try {
      await axiosInstance.put(`/equipments/${equipmentId}`, {
        category_id: null,
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      await Promise.all([fetchAssignedEquipments(), fetchAvailableEquipments()]);
      toast.success("Équipement retiré avec succès");
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      toast.error("Erreur lors du retrait de l'équipement");
    }
  };

  // Soumission du formulaire de modification de la catégorie
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name: catName, description: catDescription };
      const response = await axiosInstance.put(`/equipments/categories/${category.id}`, payload);
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
      title={`Détails de la catégorie d'équipement : ${category.name}`}
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
          <label htmlFor="categoryName" className={modalStyles.label}>Nom de la catégorie</label>
          <input
            id="categoryName"
            type="text"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            required
            placeholder="Nom de la catégorie"
            className={modalStyles.input}
          />
        </div>
        <div className={modalStyles.formGroup}>
          <label htmlFor="categoryDesc" className={modalStyles.label}>Description</label>
          <textarea
            id="categoryDesc"
            value={catDescription}
            onChange={(e) => setCatDescription(e.target.value)}
            placeholder="Description"
            className={modalStyles.textarea}
          />
        </div>
      </form>

      <h3 style={{ marginBottom: '0.5rem' }}>Équipements assignés</h3>
      {assignedEquipments.length === 0 ? (
        <p>Aucun équipement assigné à cette catégorie.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {assignedEquipments.map(eq => (
            <li
              key={eq.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0',
                borderBottom: '1px solid #eee',
              }}
            >
              <span>{eq.name} ({formatPrice(eq.price_ht)} € HT)</span>
              <Button
                variant="danger"
                size="small"
                text="Retirer"
                onClick={() => handleRemoveEquipment(eq.id)}
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
          value={selectedEquipmentId}
          onChange={(e) => setSelectedEquipmentId(Number(e.target.value))}
          style={{ padding: '8px', flex: 1 }}
        >
          <option value="">-- Sélectionner un équipement --</option>
          {availableEquipments.map(eq => (
            <option key={eq.id} value={eq.id}>
              {eq.name} ({formatPrice(eq.price_ht)} € HT)
            </option>
          ))}
        </select>
        <Button
          variant="add"
          text="Ajouter"
          onClick={handleAddEquipment}
          type="button"
          size="small"
        />
      </div>
    </CreateModal>
  );
};

export default ViewEquipmentCategoryModal;
