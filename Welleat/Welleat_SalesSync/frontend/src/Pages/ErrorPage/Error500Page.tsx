// Dossier : src/Pages/Error500Page | Fichier : Error500Page.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import * as styles from '../ErrorPage/ErrorPage.css';
import erreur500Image from '../../assets/images/erreur_500.png';
import Button from '../../components/Button/Button';

interface Error500PageProps {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
  onReset?: () => void;
  onRefresh?: () => void;
}

const Error500Page: React.FC<Error500PageProps> = ({
  error,
  errorInfo,
  onReset,
  onRefresh,
}) => {
  const navigate = useNavigate();

  // Navigation vers la page d'accueil ou de connexion selon l'authentification
  const handleGoHome = () => {
    const isAuthenticated = true; // À adapter selon votre logique
    if (isAuthenticated) {
      navigate('/homepage');
    } else {
      navigate('/');
    }
  };

  // Fonction de réinitialisation par défaut
  const handleReset = () => {
    console.warn('Aucune fonction de réinitialisation fournie.');
  };

  return (
    <GreenBackground>
      <div className={styles.rectangle}>
        <img
          src={erreur500Image}
          alt="Erreur 500"
          className={styles.errorImage}
        />
        <h1>Erreur serveur</h1>
        <p>Une erreur inattendue s'est produite sur le serveur.</p>
        {process.env.NODE_ENV === 'development' && error && (
          <div className={styles.errorDetails}>
            <h3>Détails de l'erreur :</h3>
            <pre>{error.message}</pre>
            {errorInfo && (
              <details>
                <summary>Trace de la pile</summary>
                <pre>{errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        )}
        <div className={styles.errorActions}>
          {onRefresh && (
            <Button
              variant="primary"
              size="medium"
              text="Actualiser la page"
              onClick={onRefresh}
            />
          )}
          <Button
            variant="secondary"
            size="medium"
            text="Réessayer"
            onClick={onReset || handleReset}
          />
          <Button
            variant="reset"
            size="medium"
            text="Retour à l'accueil"
            onClick={handleGoHome}
          />
        </div>
      </div>
    </GreenBackground>
  );
};

export default Error500Page;
