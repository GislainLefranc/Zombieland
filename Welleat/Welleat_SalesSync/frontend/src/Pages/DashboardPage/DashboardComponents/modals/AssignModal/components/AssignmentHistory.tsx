// Dossier : src/components/DashboardComponents/modals/AssignModal/components
// Fichier : AssignmentHistory.tsx
// Ce composant affiche l'historique des assignations. Pour chaque enregistrement, il propose des actions
// pour revenir en arrière (revert) ou réappliquer l'assignation.

import React from 'react';
import * as styles from '../AssignModal.css';
import { Assignment } from '../types/assignModal';

interface AssignmentHistoryProps {
  history: Assignment[];           // Liste des enregistrements d'assignations
  onRevert: (id: number) => void;    // Fonction appelée pour revenir en arrière sur une assignation
  onReapply: (id: number) => void;   // Fonction appelée pour réappliquer une assignation
}

export const AssignmentHistory: React.FC<AssignmentHistoryProps> = ({
  history,
  onRevert,
  onReapply,
}) => {
  return (
    <div>
      <h3>Historique des Assignations</h3>
      {history.length === 0 ? (
        <p>Aucune assignation précédente.</p>
      ) : (
        <ul>
          {history.map(record => (
            <li key={record.id}>
              <div>
                {/* Affiche la date/heure et la description de l'assignation */}
                <strong>{record.timestamp}</strong> : {record.description}
              </div>
              <div>
                {/* Boutons pour revenir ou réappliquer l'assignation */}
                <button onClick={() => onRevert(record.id)}>
                  Retour
                </button>
                <button onClick={() => onReapply(record.id)}>
                  Réappliquer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
