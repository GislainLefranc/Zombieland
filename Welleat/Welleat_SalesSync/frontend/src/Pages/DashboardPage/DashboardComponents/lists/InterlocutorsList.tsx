// Dossier : src/components/DashboardComponents/lists
// Fichier : InterlocutorsList.tsx (version alternative)
// Cette version inclut une vérification de la validité des données et un message affiché si aucun interlocuteur n'est trouvé.

import React, { useEffect } from 'react';
import * as styles from '../styles/Lists.css';
import { Interlocutor } from '../../../../types/index';

interface InterlocutorsListProps {
  interlocutors: Interlocutor[];
  selectedItems: number[];
  setSelectedItems: (items: number[] | ((prev: number[]) => number[])) => void;
  onRowClick: (interlocutor: Interlocutor) => void;
  onSelectItem: (interlocutor: Interlocutor) => void;
}

const InterlocutorsList: React.FC<InterlocutorsListProps> = ({
  interlocutors = [],
  selectedItems,
  setSelectedItems,
  onRowClick,
}) => {
  // Journalisation des interlocuteurs pour débogage
  useEffect(() => {
    console.log('📄 InterlocutorsList - interlocutors:', interlocutors);
  }, [interlocutors]);

  // Vérifie que les données sont un tableau
  if (!Array.isArray(interlocutors)) {
    return <div>Erreur: Données non valides</div>;
  }

  // Fonction pour basculer la sélection d'un interlocuteur
  const toggleSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className={styles.listContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.columnCheckbox}>Sélection</th>
            <th className={styles.tableHeaderCell}>Prénom</th>
            <th className={styles.tableHeaderCell}>Nom</th>
            <th className={styles.tableHeaderCell}>Email</th>
            <th className={styles.tableHeaderCell}>Téléphone</th>
            <th className={styles.tableHeaderCell}>Position</th>
          </tr>
        </thead>
        <tbody>
          {interlocutors.length > 0 ? (
            interlocutors.map(interlocutor => (
              <tr
                key={interlocutor.id}
                className={styles.tableRow}
                onClick={() => onRowClick(interlocutor)}
                style={{ cursor: 'pointer' }}
              >
                <td
                  className={styles.tableCell}
                  onClick={e => {
                    e.stopPropagation();
                    toggleSelection(interlocutor.id);
                  }}
                >
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={selectedItems.includes(interlocutor.id)}
                    onChange={() => toggleSelection(interlocutor.id)}
                  />
                </td>
                <td className={styles.tableCell}>{interlocutor.firstName}</td>
                <td className={styles.tableCell}>{interlocutor.lastName}</td>
                <td className={styles.tableCell}>{interlocutor.email}</td>
                <td className={styles.tableCell}>
                  {interlocutor.phone || 'N/A'}
                </td>
                <td className={styles.tableCell}>
                  {interlocutor.position || 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                Aucun interlocuteur trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InterlocutorsList;
