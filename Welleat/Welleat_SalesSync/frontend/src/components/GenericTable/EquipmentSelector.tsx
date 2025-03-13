//// Dossier : src/components, Fichier : EquipmentSelector.tsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import Button from '../../components/Button/Button';
import * as styles from '../../styles/PagesStyles/QuoteModal/EquipmentSelector.css';
import { Equipment } from '../../types';
import { QuoteEquipmentLine } from '../../types/quotesTypes';

interface EquipmentSelectorProps {
  equipments: QuoteEquipmentLine[]; // Liste des équipements sélectionnés dans le devis
  setEquipments: React.Dispatch<React.SetStateAction<QuoteEquipmentLine[]>>; // Fonction de mise à jour des équipements du devis
}

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({ equipments, setEquipments }) => {
  const [availableEquipments, setAvailableEquipments] = useState<Equipment[]>([]); // Équipements disponibles à ajouter
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | ''>(''); // ID de l'équipement sélectionné

  // Récupération des équipements disponibles depuis l'API
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await axiosInstance.get('/equipments');
        const equipmentsArray = Array.isArray(response.data.data) ? response.data.data : [];
        setAvailableEquipments(equipmentsArray);
      } catch (error) {
        toast.error("Erreur lors de la récupération des équipements");
      }
    };
    fetchEquipments();
  }, []);

  // Fonction pour obtenir le prix de l'équipement
  const getEquipmentPrice = (item: QuoteEquipmentLine | Equipment): number => {
    if ('equipment' in item) {
      const equipment = item.equipment;
      return parseFloat(String(equipment.price_ht || equipment.priceHt || item.unit_price_ht || 0));
    }
    return parseFloat(String(item.price_ht || item.priceHt || 0));
  };

  // Ajout d'un équipement sélectionné à la liste du devis
  const handleAddEquipment = () => {
    if (!selectedEquipmentId) {
      toast.error("Veuillez sélectionner un équipement");
      return;
    }
    if (equipments.some(item => item.equipment.id === selectedEquipmentId)) {
      toast.error("Cet équipement est déjà ajouté");
      return;
    }
    const equipmentToAdd = availableEquipments.find(eq => eq.id === selectedEquipmentId);
    if (equipmentToAdd) {
      const originalPrice = getEquipmentPrice(equipmentToAdd);
      const newEquipmentLine: QuoteEquipmentLine = {
        equipment_id: equipmentToAdd.id,
        equipment: {
          ...equipmentToAdd,
          price_ht: originalPrice
        },
        quantity: 1,
        isFirstUnitFree: false,
        unit_price_ht: originalPrice
      };
      setEquipments([...equipments, newEquipmentLine]);
      setSelectedEquipmentId('');
    }
  };

  // Modification de la quantité d'un équipement dans le devis
  const handleQuantityChange = (equipmentId: number, quantity: number) => {
    const updated = equipments.map(item =>
      item.equipment.id === equipmentId ? { ...item, quantity } : item
    );
    setEquipments(updated);
  };

  // Bascule de la gratuité de la première unité pour un équipement
  const handleToggleFirstUnitFree = (equipmentId: number) => {
    const updated = equipments.map(item =>
      item.equipment.id === equipmentId ? { ...item, isFirstUnitFree: !item.isFirstUnitFree } : item
    );
    setEquipments(updated);
  };

  // Suppression d'un équipement de la liste du devis
  const handleRemoveEquipment = (equipmentId: number) => {
    const updated = equipments.filter(item => item.equipment.id !== equipmentId);
    setEquipments(updated);
  };

  return (
    <div className={styles.container}>
      <h3>Equipements</h3>
      <div className={styles.formGroup}>
        <label>Sélectionnez un équipement</label>
        <select
          value={selectedEquipmentId}
          onChange={(e) => setSelectedEquipmentId(Number(e.target.value))}
          className={styles.select}
        >
          <option value="">-- Choisissez un équipement --</option>
          {availableEquipments.map(equipment => (
            <option key={equipment.id} value={equipment.id}>
              {equipment.name} ({getEquipmentPrice(equipment).toFixed(2)} € HT)
            </option>
          ))}
        </select>
        <Button variant="add" text="Ajouter" onClick={handleAddEquipment} type="button" />
      </div>

      {equipments.length > 0 && (
        <table className={styles.equipmentList}>
          <thead>
            <tr className={styles.tableRow}>
              <th className={styles.tableHeaderCell}>Nom de l'équipement</th>
              <th className={styles.tableHeaderCell}>Prix HT</th>
              <th className={styles.tableHeaderCell}>Quantité</th>
              <th className={styles.tableHeaderCell}>Première unité gratuite</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map(item => (
              <tr key={item.equipment.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{item.equipment.name}</td>
                <td className={styles.tableCell}>{getEquipmentPrice(item).toFixed(2)} €</td>
                <td className={styles.tableCell}>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => handleQuantityChange(item.equipment.id, Number(e.target.value))}
                    className={styles.input}
                  />
                </td>
                <td className={styles.tableCell}>
                  <input
                    type="checkbox"
                    checked={item.isFirstUnitFree}
                    onChange={() => handleToggleFirstUnitFree(item.equipment.id)}
                    className={styles.checkbox}
                  />
                </td>
                <td className={styles.tableCell}>
                  <Button 
                    variant="cancel" 
                    text="Retirer" 
                    onClick={() => handleRemoveEquipment(item.equipment.id)}
                    type="button"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EquipmentSelector;
