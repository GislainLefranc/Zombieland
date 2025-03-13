// Dossier : src/Pages/Error403Page | Fichier : Error403Page.tsx

import React from 'react';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import * as styles from '../ErrorPage/ErrorPage.css';
import erreur403Image from '../../assets/images/Erreur_403.png';

const Error403Page: React.FC = () => (
  <GreenBackground>
    <div className={styles.rectangle}>
      <img
        src={erreur403Image}
        alt="Erreur 403"
        className={styles.errorImage}
      />
      <h1>Accès interdit</h1>
      <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
    </div>
  </GreenBackground>
);

export default Error403Page;
