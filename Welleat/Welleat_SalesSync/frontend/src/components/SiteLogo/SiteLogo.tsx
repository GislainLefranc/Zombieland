//// Dossier : src/components, Fichier : SiteLogo.tsx
// Ce composant affiche le logo du site et le titre de l'application.
// Il ajuste son style selon que le mode responsive est activé ou non.

import React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './SiteLogo.css';
import logo from '../../assets/images/Logo_welleat.svg';

interface SiteLogoProps {
  responsive?: boolean; // Active le style responsive si vrai
}

const SiteLogo: React.FC<SiteLogoProps> = ({ responsive = true }) => {
  return (
    <div
      className={
        responsive ? styles.siteLogoContainer : styles.siteLogoContainerFixed
      }
    >
      <Link to="/homepage" className={styles.logoLink}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoCircle} />
          <img
            src={logo}
            alt="Welleat Logo"
            className={responsive ? styles.siteLogo : styles.siteLogoFixed}
          />
        </div>
      </Link>
      <h1 className={responsive ? styles.siteTitle : styles.siteTitleFixed}>
        Welleat SalesSync
      </h1>
    </div>
  );
};

export default SiteLogo;
