// Dossier : src/components/DashboardComponents/modals/AssignModal/components
// Fichier : BulkActionBar.tsx
// Ce composant affiche une barre d'actions en masse pour les éléments sélectionnés.
// Il propose des actions telles que vider la sélection et inverser la sélection.

import React from 'react';
import * as styles from '../AssignModal.css';

interface BulkActionBarProps {
  selectedCount: number;            // Nombre d'éléments actuellement sélectionnés
  onClearAll: () => void;           // Fonction pour effacer la sélection
  onInvertSelection: () => void;    // Fonction pour inverser la sélection (les non-sélectionnés deviennent sélectionnés, et vice-versa)
  onAutoAssign: () => void;         // Fonction pour une assignation automatique (actuellement commentée)
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClearAll,
  onInvertSelection,
  onAutoAssign,
}) => {
  return (
    <div className={styles.bulkActionBar}>
      <span>{selectedCount} éléments sélectionnés</span>
      <div className={styles.bulkActions}>
        <button onClick={onClearAll} className={styles.bulkButton}>
          Vider Sélection
        </button>
        <button onClick={onInvertSelection} className={styles.bulkButton}>
          Inverser Sélection
        </button>
        {/*
          Bouton d'assignation automatique commenté car non utilisé actuellement.
          <button onClick={onAutoAssign} className={styles.bulkButton}>
            Assignation Automatique
          </button>
        */}
      </div>
    </div>
  );
};
