//// Dossier : src/components, Fichier : SupportLink.tsx
// Ce composant affiche un lien de support.
// En cas de problème, l'utilisateur peut cliquer sur le lien pour envoyer un email au support.

import React from 'react';
import * as styles from './SupportLink.css';

interface SupportLinkProps {}

const SupportLink: React.FC<SupportLinkProps> = () => {
  return (
    <div className={styles.supportContainer}>
      <a href="mailto:support@votresite.com" className={styles.supportLink}>
        <span className={styles.supportText}>
          En cas de problème merci de contacter le support
        </span>
        <span className={styles.supportIcon}>?</span>
      </a>
    </div>
  );
};

export default SupportLink;
