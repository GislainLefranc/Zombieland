//// Dossier : frontend/src/components, Fichier : EquipementTable.tsx

import React from 'react';
import GenericTable, { TableColumn } from './GenericTable';
import { Equipment } from '../../types';
import * as styles from './GenericTable.css';
import EditIcon from '../../styles/icons/EditIcon';
import DeleteIcon from '../../styles/icons/DeleteIcon';

interface EquipementTableProps {
  equipements: Equipment[]; // Liste des équipements à afficher
  loading: boolean;         // Indicateur de chargement
  onEdit?: (equipment: Equipment) => void;   // Fonction pour éditer un équipement
  onDelete?: (equipment: Equipment) => void; // Fonction pour supprimer un équipement
}

// Composant d'affichage des équipements sous forme de tableau
const EquipementTable: React.FC<EquipementTableProps> = ({ equipements, loading, onEdit, onDelete }) => {

  // Formatage du prix en ajoutant l'unité et en fixant le nombre de décimales
  const formatPrice = (price?: number) => (typeof price === 'number' ? `${price.toFixed(2)}€` : 'N/A');

  // Définition des colonnes du tableau
  const columns: TableColumn<Equipment>[] = [
    {
      header: 'ID',
      accessor: 'id',
      width: '50px',
    },
    {
      header: 'Nom',
      accessor: 'name',
      width: '150px',
    },
    {
      header: 'Prix HT (€)',
      accessor: 'price_ht',
      cell: (row: Equipment) => formatPrice(row.price_ht),
      width: '100px',
    },
    {
      header: 'Prix TTC (€)',
      accessor: 'price',
      cell: (row: Equipment) => formatPrice(row.price),
      width: '100px',
    },
    {
      header: 'Actions',
      accessor: undefined,
      // Rendu personnalisé pour les boutons d'action
      cell: (equipment: Equipment) => (
        <div className={styles.actionButtons}>
          <button
            onClick={() => onEdit && onEdit(equipment)}
            className={styles.actionButton}
            aria-label="Éditer l'équipement"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete && onDelete(equipment)}
            className={styles.actionButton}
            aria-label="Supprimer l'équipement"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
      width: '50px',
    },
  ];

  // Rendu du tableau avec les équipements
  return (
    <GenericTable
      data={equipements}
      columns={columns}
      loading={loading}
      emptyMessage="Aucun équipement disponible"
    />
  );
};

export default EquipementTable;
