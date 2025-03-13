//// Dossier : frontend/src/components, Fichier : FormulaTable.tsx

import React from 'react';
import GenericTable, { TableColumn } from './GenericTable';
import { Formula } from '../../types';
import * as styles from './GenericTable.css';
import EditIcon from '../../styles/icons/EditIcon';
import DeleteIcon from '../../styles/icons/DeleteIcon';

interface FormulaTableProps {
  formulas: Formula[];            // Liste des formules à afficher
  loading: boolean;               // Indicateur de chargement des données
  onEdit?: (formula: Formula) => void;   // Fonction pour modifier une formule
  onDelete?: (formula: Formula) => void; // Fonction pour supprimer une formule
}

// Composant d'affichage des formules sous forme de tableau
const FormulaTable: React.FC<FormulaTableProps> = ({ formulas, loading, onEdit, onDelete }) => {
  // Fonction pour formater le prix avec 2 décimales et ajouter l'unité €
  const formatPrice = (value?: string | number) => {
    if (!value) return 'N/A';
    const price = typeof value === 'string' ? parseFloat(value) : value;
    return `${price.toFixed(2)}€`;
  };

  // Définition des colonnes du tableau
  const columns: TableColumn<Formula>[] = [
    {
      header: 'Nom',
      accessor: 'name',
      width: '200px', // Largeur fixe
    },
    {
      header: 'Description',
      accessor: 'description',
      width: '300px',
    },
    {
      header: 'Prix HT',
      accessor: 'price_ht',
      cell: (formula: Formula) => formatPrice(formula.price_ht),
      width: '120px',
    },
    {
      header: 'Prix TTC',
      accessor: 'price_ttc',
      cell: (formula: Formula) => formatPrice(formula.price_ttc),
      width: '120px',
    },
    {
      header: 'Actions',
      accessor: undefined,
      // Rendu personnalisé pour les boutons d'action
      cell: (formula: Formula) => (
        <div className={styles.actionButtons}>
          <button onClick={() => onEdit && onEdit(formula)} className={styles.actionButton}>
            <EditIcon />
          </button>
          <button onClick={() => onDelete && onDelete(formula)} className={styles.actionButton}>
            <DeleteIcon />
          </button>
        </div>
      ),
      width: '100px',
    }
  ];

  // Rendu du tableau avec les formules
  return (
    <GenericTable
      data={formulas}
      columns={columns}
      loading={loading}
      emptyMessage="Aucune formule disponible"
    />
  );
};

export default FormulaTable;
