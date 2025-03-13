//// Dossier : frontend/src/components, Fichier : Pagination.tsx

import React from 'react';
import * as styles from './Pagination.css';
import Button from '../Button/Button';

// Interface des propriétés pour le composant de pagination
interface PaginationProps {
  currentPage: number; // Page actuelle
  totalPages: number;  // Nombre total de pages
  onPrevious: () => void; // Fonction pour aller à la page précédente
  onNext: () => void;     // Fonction pour aller à la page suivante
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <div className={styles.pagination}>
      {/* Bouton pour la page précédente */}
      <Button
        variant="primary"
        text="Précédent"
        onClick={onPrevious}
        disabled={currentPage === 1} // Désactiver si page 1
        size="small"
      />
      {/* Affichage du numéro de page */}
      <span className={styles.paginationSpan}>
        {currentPage} / {totalPages}
      </span>
      {/* Bouton pour la page suivante */}
      <Button
        variant="primary"
        text="Suivant"
        onClick={onNext}
        disabled={currentPage === totalPages} // Désactiver si dernière page
        size="small"
      />
    </div>
  );
};

export default Pagination;
