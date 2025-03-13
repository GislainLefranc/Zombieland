//// Dossier : src/components, Fichier : OptionTable.tsx

import React from 'react';
import GenericTable, { TableColumn } from './GenericTable';
import type { Option } from '../../types';
import * as styles from './GenericTable.css';
import EditIcon from '../../styles/icons/EditIcon';
import DeleteIcon from '../../styles/icons/DeleteIcon';

const TAX_RATE = 0.2; // Taux de TVA

// Fonction pour formater un prix avec 2 décimales et ajouter l'unité €
const formatPrice = (value?: string | number) => {
  if (!value) return 'N/A';
  const price = typeof value === 'string' ? parseFloat(value) : value;
  return `${price.toFixed(2)}€`;
};

interface OptionTableProps {
  options: Option[];    // Liste des options à afficher
  loading: boolean;     // Indicateur de chargement
  onEdit?: (option: Option) => void;   // Fonction pour modifier une option
  onDelete?: (option: Option) => void; // Fonction pour supprimer une option
}

// Composant d'affichage des options sous forme de tableau
const OptionTable: React.FC<OptionTableProps> = ({ options, loading, onEdit, onDelete }) => {
  // Définition des colonnes du tableau
  const columns: TableColumn<Option>[] = [
    {
      header: 'Nom',
      accessor: 'name',
      width: '200px',
    },
    {
      header: 'Description',
      accessor: 'description',
      width: '300px',
    },
    {
      header: 'Prix HT',
      accessor: 'price_ht',
      cell: (option: Option) => formatPrice(option.price_ht || option.priceHt),
      width: '120px',
    },
    {
      header: 'Prix TTC',
      accessor: 'price_ttc',
      cell: (option: Option) => {
        // Calcul du prix TTC à partir du prix HT
        const priceHT = parseFloat((option.price_ht || option.priceHt)?.toString() || '0');
        const priceTTC = priceHT * (1 + TAX_RATE);
        return formatPrice(priceTTC);
      },
      width: '120px',
    },
    {
      header: 'Actions',
      accessor: undefined,
      cell: (option: Option) => (
        <div className={styles.actionButtons}>
          <button onClick={() => onEdit && onEdit(option)} className={styles.actionButton}>
            <EditIcon />
          </button>
          <button onClick={() => onDelete && onDelete(option)} className={styles.actionButton}>
            <DeleteIcon />
          </button>
        </div>
      ),
      width: '100px',
    }
  ];

  return (
    <GenericTable
      data={options}
      columns={columns}
      loading={loading}
      emptyMessage="Aucune option disponible"
    />
  );
};

export default OptionTable;
