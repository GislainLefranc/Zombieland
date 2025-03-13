// Dossier : src/components/DashboardComponents/modals/AssignModal/components
// Fichier : PreviewPanel.tsx
// Ce composant affiche un aperçu des assignations en cours, récapitulant le nombre d'établissements,
// d'interlocuteurs et de membres assignés. Il inclut également un bouton pour confirmer l'assignation.

import React from 'react';
import * as styles from '../AssignModal.css';
import { SelectedEntities } from '../../../../../../types/index';

interface PreviewPanelProps {
  selected: SelectedEntities; // Ensemble des entités sélectionnées (entreprises, interlocuteurs, utilisateurs)
  onConfirm: () => void;        // Fonction déclenchée pour confirmer l'assignation
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  selected,
  onConfirm,
}) => {
  return (
    <div className={styles.previewPanel}>
      <h5>Prévisualisation des Assignations</h5>
      <div className={styles.assignmentsSummary}>
        <p>Nombre d'Établissements assignés : {selected.companies.size}</p>
        <p>Nombre d'Interlocuteurs assignés : {selected.interlocutors.size}</p>
        <p>Nombre de Membres assignés : {selected.users.size}</p>
      </div>
      <button className={styles.assignButton} onClick={onConfirm}>
        Confirmer l'Assignation
      </button>
    </div>
  );
};
