//// Dossier : src/components/GreenBackground, Fichier : GreenBackground.tsx

import React from 'react';
import * as styles from './GreenBackground.css'; 

interface GreenBackgroundProps {
  children: React.ReactNode; // Contenu à afficher dans le fond vert
}

// Composant pour afficher un fond vert avec un rectangle centré
const GreenBackground: React.FC<GreenBackgroundProps> = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.rectangle}>
        {children}
      </div>
    </div>
  );
};

export default GreenBackground;
