//// Dossier: frontend/src/components, Fichier: BaseTable.tsx

import React from 'react';
import * as baseStyles from './BaseTable.css';

// Interface pour la définition d'une colonne du tableau
export interface BaseTableColumn<T> {
  header: string; // Titre de la colonne
  accessor?: keyof T | ((row: T) => React.ReactNode); // Clé d'accès ou fonction pour récupérer la valeur de la ligne
  renderCell?: (row: T) => React.ReactNode; // Fonction personnalisée pour le rendu de la cellule
  width?: string | number; // Largeur de la colonne
}

// Interface pour les propriétés du composant BaseTable
export interface BaseTableProps<T> {
  data: T[]; // Tableau de données à afficher
  columns: BaseTableColumn<T>[]; // Configuration des colonnes
  loading?: boolean; // Indique si les données sont en cours de chargement
  emptyMessage?: string; // Message à afficher si aucune donnée n'est présente
  onRowClick?: (row: T) => void; // Fonction appelée lors du clic sur une ligne
}

// Composant de tableau générique
function BaseTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'Aucune donnée disponible',
  onRowClick,
}: BaseTableProps<T>) {
  // Affiche un message de chargement si les données sont en cours de chargement
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Affiche un message vide si aucune donnée n'est présente
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
                key={`head-${index}`}
                className={baseStyles.tableHeader}
                style={{ width: col.width || 'auto' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={baseStyles.tableRow}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col, colIndex) => {
                // Si une fonction de rendu personnalisée est définie, l'utiliser
                if (col.renderCell) {
                  return (
                    <td key={`cell-${rowIndex}-${colIndex}`} className={baseStyles.tableCell}>
                      {col.renderCell(row)}
                    </td>
                  );
                }
                // Si accessor est une fonction, l'appeler avec la ligne
                else if (typeof col.accessor === 'function') {
                  return (
                    <td key={`cell-${rowIndex}-${colIndex}`} className={baseStyles.tableCell}>
                      {col.accessor(row)}
                    </td>
                  );
                }
                // Si accessor est une chaîne, accéder à la valeur correspondante de la ligne
                else if (typeof col.accessor === 'string') {
                  const value = row[col.accessor];
                  return (
                    <td key={`cell-${rowIndex}-${colIndex}`} className={baseStyles.tableCell}>
                      {value !== undefined && value !== null ? value.toString() : ''}
                    </td>
                  );
                }
                // Si aucune valeur n'est fournie, afficher une cellule vide
                else {
                  return (
                    <td key={`cell-${rowIndex}-${colIndex}`} className={baseStyles.tableCell} />
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BaseTable;
