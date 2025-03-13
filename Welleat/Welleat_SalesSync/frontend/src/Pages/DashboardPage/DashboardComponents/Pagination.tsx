/**
 * Dossier : src/DashboardComponents
 * Fichier : Pagination.tsx
 *
 * Ce fichier définit le composant Pagination qui affiche les boutons de navigation
 * pour paginer les éléments affichés dans le dashboard.
 */

import React from 'react';
import * as styles from '../../../components/DashboardSearchComponents/Pagination.css';
import Button from '../../../components/Button/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <div className={styles.pagination}>
      <Button
        variant="primary"
        text="Précédent"
        onClick={onPrevious}
        disabled={currentPage === 1}
        size="small"
      />
      <span className={styles.paginationSpan}>
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="primary"
        text="Suivant"
        onClick={onNext}
        disabled={currentPage === totalPages}
        size="small"
      />
    </div>
  );
};

export default Pagination;
