//// Dossier : src/components, Fichier : NotFound.tsx
// Ce composant affiche une page d'erreur 404 pour indiquer que la page demandée n'existe pas.
// Il propose un lien pour retourner à la page d'accueil.

import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page non trouvée</h2>
      <p>Désolé, la page que vous recherchez n'existe pas.</p>
      <Link to="/">Retour à la page d'accueil</Link>
    </div>
  );
};

export default NotFound;
