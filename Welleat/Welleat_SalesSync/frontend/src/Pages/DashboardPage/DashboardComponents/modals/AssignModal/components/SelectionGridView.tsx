// Dossier : src/components/DashboardComponents/modals/AssignModal/components
// Fichier : SelectionGridView.tsx
// Ce composant affiche une grille de sélection divisée en colonnes pour les entreprises, interlocuteurs et utilisateurs.
// Chaque colonne affiche les éléments disponibles et met en évidence ceux qui sont sélectionnés.

import React from 'react';
import * as styles from '../AssignModal.css';
import { SelectableItem, SelectedEntities } from '../../../../../../types/index';

interface ColumnProps {
  title: string;                  // Titre de la colonne
  items: SelectableItem[];        // Liste des éléments à afficher dans la colonne
  selected: Set<number>;          // Ensemble des IDs sélectionnés dans cette colonne
  onSelect: (id: number) => void;  // Fonction appelée lors de la sélection d'un élément
}

// Composant représentant une colonne individuelle dans la grille de sélection
const Column: React.FC<ColumnProps> = ({
  title,
  items,
  selected,
  onSelect,
}) => (
  <div className={styles.column}>
    <div className={styles.sectionHeader}>
      <h5 className={styles.sectionTitle}>{title}</h5>
    </div>
    <div className={styles.columnContent}>
      {items.length === 0 ? (
        <p>Aucun élément trouvé.</p>
      ) : (
        items.map(item => (
          <div
            key={item.id}
            className={`${styles.listItem} ${selected.has(item.id) ? styles.selectedItem : ''}`}
            onClick={() => onSelect(item.id)}
          >
            {item.name}
            {item.email && <small>{item.email}</small>}
          </div>
        ))
      )}
    </div>
  </div>
);

interface SelectionGridViewProps {
  data: {
    companies: SelectableItem[];
    interlocutors: SelectableItem[];
    users: SelectableItem[];
  };
  selected: SelectedEntities;  // Objets contenant les ensembles de sélection pour chaque catégorie
  onSelect: (category: keyof SelectedEntities, id: number) => void; // Fonction de sélection d'un élément dans une catégorie
}

export const SelectionGridView: React.FC<SelectionGridViewProps> = ({
  data,
  selected,
  onSelect,
}) => (
  <div className={styles.columnsContainer}>
    <Column
      title="Établissements"
      items={data.companies}
      selected={selected.companies}
      onSelect={id => onSelect('companies', id)}
    />
    <Column
      title="Interlocuteurs"
      items={data.interlocutors}
      selected={selected.interlocutors}
      onSelect={id => onSelect('interlocutors', id)}
    />
    <Column
      title="Membres Welleat"
      items={data.users}
      selected={selected.users}
      onSelect={id => onSelect('users', id)}
    />
  </div>
);
