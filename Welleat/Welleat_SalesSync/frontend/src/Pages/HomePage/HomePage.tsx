// Dossier : src/Pages/HomePage | Fichier : HomePage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import Button from '../../components/Button/Button';
import ImageAccueil from '../../assets/images/Image_accueil.png';
import * as styles from './HomePage.css'; // Chemin vers le fichier CSS

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Démarrer la simulation
  const handleStart = () => {
    navigate('/simulation');
  };

  return (
    <GreenBackground>
      <div className={styles.homeContent}>
        <h2 className={styles.homeTitle}>Bienvenue sur Welleat SalesSync</h2>
        <h4 className={styles.homeSubtitle}>
          Synchronisation des efforts de vente, du devis au suivi client
        </h4>
        <img src={ImageAccueil} alt="Accueil" className={styles.homeImage} />
        <div className={styles.buttonContainer}>
          <Button text="Commencer" onClick={handleStart} />
        </div>
      </div>
    </GreenBackground>
  );
};

export default HomePage;
