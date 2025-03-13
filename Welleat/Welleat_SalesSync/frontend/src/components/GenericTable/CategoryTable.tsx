//// Dossier : frontend/src/components, Fichier : CategoryTable.tsx

import React from 'react';
import BaseTable, { BaseTableColumn } from '../BaseTable/BaseTable';
import EditIcon from '../../styles/icons/EditIcon';
import DeleteIcon from '../../styles/icons/DeleteIcon';
import * as baseStyles from '../BaseTable/BaseTable.css';

export interface Category {
  id: number; // Identifiant de la catégorie
  name: string; // Nom de la catégorie
  description?: string; // Description de la catégorie
  is_default?: boolean; // Indique si c'est la catégorie par défaut
}

interface CategoryTableProps {
  categories: Category[]; // Liste des catégories
  loading?: boolean; // Indique si les données sont en cours de chargement
  onEdit?: (category: Category) => void; // Fonction pour modifier une catégorie
  onDelete?: (category: Category) => void; // Fonction pour supprimer une catégorie
  onRowClick?: (category: Category) => void; // Fonction pour gérer le clic sur une ligne
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  loading = false,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  // Configuration des colonnes du tableau
  const columns: BaseTableColumn<Category>[] = [
    {
      header: 'ID',
      accessor: 'id',
      width: '60px',
    },
    {
      header: 'Nom',
      accessor: 'name',
      width: '180px',
    },
    {
      header: 'Description',
      accessor: 'description',
      width: 'auto',
    },
    {
      header: 'Actions',
      width: '80px',
      // Rendu personnalisé de la cellule pour les actions
      renderCell: (cat: Category) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            aria-label="Modifier"
            className={baseStyles.tableCell}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(cat); }}
          >
            <EditIcon />
          </button>
          <button
            aria-label="Supprimer"
            className={baseStyles.tableCell}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(cat); }}
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <BaseTable
      data={categories}
      columns={columns}
      loading={loading}
      emptyMessage="Aucune catégorie disponible"
      onRowClick={onRowClick}
    />
  );
};

export default CategoryTable;
