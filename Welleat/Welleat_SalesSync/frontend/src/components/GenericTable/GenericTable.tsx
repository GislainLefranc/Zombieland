//// Dossier : src/components/GenericTable, Fichier : GenericTable.tsx

import React from 'react';
import * as baseStyles from './GenericTable.css';

// Définition du type d'une colonne du tableau
export interface TableColumn<T> {
  header: string; // Titre de la colonne
  accessor?: keyof T | ((row: T) => React.ReactNode); // Clé ou fonction pour accéder à la valeur
  cell?: (row: T) => React.ReactNode; // Fonction de rendu personnalisé de la cellule
  width?: string | number; // Largeur de la colonne
}

// Propriétés attendues par le composant GenericTable
export interface GenericTableProps<T> {
  data: T[]; // Données à afficher
  columns: TableColumn<T>[]; // Configuration des colonnes
  loading?: boolean; // Indique si le tableau est en cours de chargement
  emptyMessage?: string; // Message à afficher s'il n'y a pas de données
}

// Composant de tableau générique
const GenericTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
}: GenericTableProps<T>) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <div className={baseStyles.tableContainer}>
      <table className={baseStyles.table}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                style={{ width: col.width || 'auto' }}
                className={baseStyles.tableHeader}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={baseStyles.tableRow}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={baseStyles.tableCell}>
                  {col.cell
                    ? col.cell(row)
                    : typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : row[col.accessor as keyof T] !== undefined && row[col.accessor as keyof T] !== null
                        ? row[col.accessor as keyof T].toString()
                        : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
