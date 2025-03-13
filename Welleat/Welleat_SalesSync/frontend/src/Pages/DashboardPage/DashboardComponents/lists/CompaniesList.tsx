// Dossier : src/components/DashboardComponents/lists
// Fichier : CompaniesList.tsx
// Ce composant affiche la liste des établissements sous forme de tableau.
// Il gère la sélection d'une ligne, et permet de cliquer sur une ligne pour afficher plus de détails.

import React, { memo, useEffect } from 'react';
import { Company, ListViewProps } from '../../../../types';
import * as styles from '../styles/Lists.css';
import { useSelection } from '../../../../hooks/useSelection';

interface CompaniesListProps extends ListViewProps<Company> {
  items: Company[];
}

const CompaniesList: React.FC<CompaniesListProps> = ({
  items,
  selectedItems,
  setSelectedItems,
  onRowClick,
}) => {
  // Affiche dans la console les établissements à chaque mise à jour
  useEffect(() => {
    console.log('📄 CompaniesList - items:', items);
  }, [items]);

  // Fonction pour basculer la sélection d'un établissement
  const toggleSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Fonction pour afficher "Oui" si un commentaire est présent, sinon "Non"
  const renderCommentCell = (comment?: string) =>
    comment && comment.trim() !== '' ? 'Oui' : 'Non';

  return (
    <div className={styles.listContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.columnCheckbox}>Sélection</th>
            <th className={styles.columnIdHeader}>ID</th>
            <th className={styles.tableHeaderCell}>Nom de l'établissement</th>
            <th className={styles.tableHeaderCell}>Adresse</th>
            <th className={styles.tableHeaderCell}>Ville</th>
            <th className={styles.tableHeaderCell}>Code Postal</th>
            <th className={styles.tableHeaderCell}>Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {items?.map(company => (
            <tr
              key={company.id}
              className={styles.tableRow}
              onClick={() => onRowClick(company)}
            >
              <td
                className={styles.tableCell}
                onClick={e => e.stopPropagation()} // Empêche la propagation pour ne pas déclencher onRowClick lors de la sélection
              >
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={selectedItems.includes(company.id)}
                  onChange={() => toggleSelection(company.id)}
                />
              </td>
              <td className={styles.columnId}>{company.id}</td>
              <td className={styles.tableCell}>{company.name}</td>
              <td className={styles.tableCell}>{company.address}</td>
              <td className={styles.tableCell}>{company.city}</td>
              <td className={styles.tableCell}>{company.postalCode}</td>
              <td className={styles.tableCell}>
                {renderCommentCell(company.comments)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(CompaniesList);
