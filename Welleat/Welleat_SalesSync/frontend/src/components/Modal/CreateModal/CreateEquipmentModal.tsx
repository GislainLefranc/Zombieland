//// Dossier : src/components/Modal/CreateModal, Fichier : CreateEquipmentModal.tsx
// Cette modal permet de créer ou modifier un équipement.
// Elle gère le formulaire, le chargement des catégories, et le calcul du prix TTC.

import React, { useState, useEffect, FormEvent } from 'react';
import ReactDOM from 'react-dom';
import CreateModal from './CreateModal';
import * as modalStyles from '../../../styles/Modals/Modal.css';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import Button from '../../Button/Button';
import { Equipment } from '../../../types';

interface EquipmentCategory {
  id: number;
  name: string;
  description?: string;
  is_default?: boolean;
}

interface CreateEquipmentModalProps {
  isOpen: boolean; // Modal ouverte ou fermée
  onClose: () => void; // Fonction pour fermer la modal
  onSuccess: () => void; // Callback en cas de succès
  equipment?: Equipment | null; // Équipement à modifier (facultatif)
}

const TAX_RATE = 0.2;

const CreateEquipmentModal: React.FC<CreateEquipmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  equipment = null,
}) => {
  // États pour les champs du formulaire, pré-remplis en cas d'édition
  const [name, setName] = useState(equipment ? equipment.name : '');
  const [description, setDescription] = useState(equipment ? equipment.description || '' : '');
  const [freeEquipment, setFreeEquipment] = useState(equipment ? equipment.free_equipment : false);
  const [priceWithoutTax, setPriceWithoutTax] = useState<string>(equipment ? equipment.price_ht.toString() : '');
  const [notes, setNotes] = useState(equipment ? equipment.notes || '' : '');

  // États pour la gestion des catégories disponibles et la sélection
  const [availableCategories, setAvailableCategories] = useState<EquipmentCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>(
    equipment && equipment.category && (equipment.category as any).id ? Number((equipment.category as any).id) : ''
  );

  // Au montage ou à l'ouverture, réinitialiser les champs en fonction de l'équipement (édition) ou non (création)
  useEffect(() => {
    if (equipment) {
      setName(equipment.name);
      setDescription(equipment.description || '');
      setFreeEquipment(equipment.free_equipment);
      setPriceWithoutTax(equipment.price_ht.toString());
      setNotes(equipment.notes || '');
      setSelectedCategoryId(
        equipment && equipment.category && (equipment.category as any).id
          ? Number((equipment.category as any).id)
          : ''
      );
    } else {
      setName('');
      setDescription('');
      setFreeEquipment(false);
      setPriceWithoutTax('');
      setNotes('');
      setSelectedCategoryId('');
    }
  }, [equipment, isOpen]);

  // Charger les catégories disponibles depuis le backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/equipments/categories');
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        if (Array.isArray(data)) {
          setAvailableCategories(data);
        } else {
          throw new Error('Réponse inattendue pour les catégories');
        }
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors du chargement des catégories");
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Fonction utilitaire pour calculer le prix TTC à partir du prix HT
  const calculateTTC = (ht: number) => (ht * (1 + TAX_RATE)).toFixed(2);

  // Gestion de la soumission du formulaire (création ou mise à jour)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const parsedPriceHT = parseFloat(priceWithoutTax) || 0;
      const priceTTC = parsedPriceHT * (1 + TAX_RATE);
  
      const payload = {
        name,
        description,
        free_equipment: freeEquipment,
        price_ht: parsedPriceHT,
        price: priceTTC,
        equipment_category_id: (selectedCategoryId && selectedCategoryId > 0) ? selectedCategoryId : null,
        notes: notes || null,
        formula_compatible: true,
        formula_discount: 0
      };
  
      console.log('[CreateEquipmentModal] Payload:', payload);
  
      if (equipment?.id) {
        // Mode édition
        await axiosInstance.put(`/equipments/${equipment.id}`, payload);
        toast.success("Équipement modifié avec succès");
      } else {
        // Mode création
        await axiosInstance.post('/equipments', payload);
        toast.success("Équipement créé avec succès");
      }
  
      await onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.error ||
        "Erreur lors du traitement"
      );
    }
  };

  // Gestion du changement dans le select de catégorie
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(Number(e.target.value));
  };

  // Détermine si on est en mode édition (modification d'un équipement existant)
  const isEditing = !!equipment;

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier l'équipement" : "Créer un équipement"}
      actions={[
        { variant: 'cancel', text: 'Annuler', onClick: onClose, type: 'button' },
        { variant: 'submit', text: isEditing ? 'Enregistrer' : 'Créer', onClick: handleSubmit, type: 'submit' },
      ]}
    >
      <form onSubmit={handleSubmit} className={modalStyles.form}>
        {/* Champ Nom */}
        <div className={modalStyles.formGroup}>
          <label htmlFor="equipmentName" className={modalStyles.label}>Nom</label>
          <input
            id="equipmentName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nom de l'équipement"
            className={modalStyles.input}
          />
        </div>
        {/* Champ Description */}
        <div className={modalStyles.formGroup}>
          <label htmlFor="equipmentDescription" className={modalStyles.label}>Description</label>
          <textarea
            id="equipmentDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de l'équipement"
            className={modalStyles.textarea}
          />
        </div>
        {/* Checkbox pour équipement gratuit */}
        <div className={modalStyles.formGroup}>
          <label htmlFor="freeEquipment" className={modalStyles.label}>Équipement gratuit</label>
          <input
            id="freeEquipment"
            type="checkbox"
            checked={freeEquipment}
            onChange={(e) => {
              const checked = e.target.checked;
              setFreeEquipment(checked);
              if (checked) {
                setPriceWithoutTax('0');
              }
            }}
          />
        </div>
        {/* Champ Prix HT */}
        <div className={modalStyles.formGroup}>
          <label htmlFor="priceWithoutTax" className={modalStyles.label}>Prix HT</label>
          <input
            id="priceWithoutTax"
            type="number"
            value={priceWithoutTax}
            onChange={(e) => setPriceWithoutTax(e.target.value)}
            required
            min="0"
            placeholder="Entrez le prix HT"
            className={modalStyles.input}
            disabled={freeEquipment}
          />
          {parseFloat(priceWithoutTax) > 0 && (
            <div className={modalStyles.priceInfo}>
              TTC: {calculateTTC(parseFloat(priceWithoutTax) || 0)} €
            </div>
          )}
        </div>
        {/* Sélecteur de catégorie */}
        <div className={modalStyles.formGroup}>
          <label htmlFor="category" className={modalStyles.label}>Catégorie</label>
          <select
            id="category"
            value={selectedCategoryId || ''}
            onChange={handleCategoryChange}
            className={modalStyles.select}
            required
            disabled={isEditing}
          >
            <option value="" disabled>-- Sélectionnez une catégorie --</option>
            {availableCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {/* Champ Notes */}
        <div className={modalStyles.formGroup}>
          <label htmlFor="notes" className={modalStyles.label}>Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes complémentaires"
            className={modalStyles.textarea}
          />
        </div>
      </form>
    </CreateModal>,
    document.body
  );
};

export default CreateEquipmentModal;
