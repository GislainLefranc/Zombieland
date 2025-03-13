// Dossier : src/components/DashboardComponents/lists
// Fichier : InterlocutorsList.tsx
// Ce composant affiche la liste des interlocuteurs avec une gestion de sélection pour chaque ligne.
// Il permet également de cliquer sur une ligne pour déclencher une action (par exemple, afficher des détails).

import React from 'react';
import * as styles from '../styles/Lists.css';
import { Interlocutor } from '../../../../types/index';

interface InterlocutorsListProps {
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  interlocutors: Interlocutor[];
  onRowClick: (interlocutor: Interlocutor) => void;
}

const InterlocutorsList: React.FC<InterlocutorsListProps> = ({
  selectedItems,
  setSelectedItems,
  interlocutors,
  onRowClick,
}) => {
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
          {interlocutors.map(interlocutor => (
            <tr
              key={interlocutor.id}
              className={styles.tableRow}
              onClick={() => onRowClick(interlocutor)}
              style={{ cursor: 'pointer' }}
            >
              <td
                className={styles.tableCell}
                onClick={e => {
                  e.stopPropagation(); // Empêche l'événement click de remonter pour éviter de déclencher onRowClick
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
              <td>{interlocutor.firstName}</td>
              <td>{interlocutor.lastName}</td>
              <td>{interlocutor.email}</td>
              <td className={styles.tableCell}>
                {interlocutor.phone || 'N/A'}
              </td>
              <td className={styles.tableCell}>
                {interlocutor.position || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterlocutorsList;
