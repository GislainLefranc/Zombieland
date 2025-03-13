// Dossier : src/Pages/Error404Page | Fichier : Error404Page.tsx

import React from 'react';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import * as styles from '../ErrorPage/ErrorPage.css';
import erreur404Image from '../../assets/images/erreur_404.avif';

const Error404Page: React.FC = () => (
  <GreenBackground>
    <div className={styles.rectangle}>
      <img
        src={erreur404Image}
        alt="Erreur 404"
        className={styles.errorImage}
      />
      <h1>Page non trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
    </div>
  </GreenBackground>
);

export default Error404Page;
