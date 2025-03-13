//// Dossier : src/components, Fichier : LoadingSpinner.jsx

import React from 'react';
import * as styles from './LoadingSpinner.css';

// Composant affichant un indicateur de chargement (spinner)
const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
