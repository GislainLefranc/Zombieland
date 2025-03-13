//// Dossier : frontend/src/components, Fichier : DashboardHeader.tsx

import React from 'react';
import * as styles from './DashboardHeader.css';
import { useAuth } from '../../context/AuthContext';

// Définition des propriétés du composant DashboardHeader
interface DashboardHeaderProps {
  title?: string; // Titre affiché dans l'en-tête
  searchTerm: string; // Terme de recherche saisi
  setSearchTerm: (term: string) => void; // Fonction pour mettre à jour le terme de recherche
  resultsCount: number; // Nombre de résultats trouvés
  onAdd?: () => void; // Fonction optionnelle pour ajouter un élément (non utilisée dans ce composant)
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'Tableau de bord',
  searchTerm,
  setSearchTerm,
  resultsCount,
}) => {
  const { user } = useAuth(); // Récupération des informations de l'utilisateur

  return (
    <div className={styles.dashboardHeader}>
      <div className={styles.headerLeft}>
        <h2 className={styles.dashboardHeaderTitle}>{title}</h2>
      </div>
      <div className={styles.headerRight}>
        <input
          type="text"
          placeholder="Rechercher"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <p className={styles.resultsCount}>{resultsCount} résultats trouvés</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
