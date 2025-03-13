// Dossier : src/components/DashboardComponents/lists
// Fichier : GenericList.tsx
// Ce composant générique permet d'afficher une liste de données sous forme de tableau,
// en gérant la sélection des éléments et en affichant le contenu selon des colonnes définies.

import React, { memo } from 'react';
import * as styles from '../styles/Lists.css';

interface Column<T> {
  header: string;          // Titre de la colonne
  accessor: keyof T;       // Propriété de l'objet à afficher
  render?: (item: T) => React.ReactNode; // Fonction personnalisée pour afficher une cellule
}

interface GenericListProps<T> {
  data: T[];
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  columns: Column<T>[];
}

const GenericList = <T extends { id: number }>(({
  data,
  selectedItems,
  setSelectedItems,
  columns,
}: GenericListProps<T>) => {
  // Fonction pour basculer la sélection d'un élément
  const toggleSelection = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.listContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.columnCheckbox}>Sélection</th>
            {columns.map((col, index) => (
              <th key={index} className={styles.tableHeaderCell}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                />
              </td>
              {columns.map((col, index) => (
                <td key={index} className={styles.tableCell}>
                  {col.render ? col.render(item) : String(item[col.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(GenericList);
