//// Dossier : src/components, Fichier : CategoryNavigationButton.tsx
// Ce composant affiche un bouton permettant de naviguer vers la page de gestion des catégories.
// Lors du clic, il redirige l'utilisateur vers la page "/categories?type=equipment".

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

const CategoryNavigationButton: React.FC = () => {
  const navigate = useNavigate();

  // Fonction déclenchée au clic qui redirige l'utilisateur vers la page des catégories d'équipements
  const handleClick = () => {
    navigate('/categories?type=equipment');
  };

  return (
    <Button
      variant="toggle"
      text="Gérer les catégories"
      onClick={handleClick}
      type="button"
    />
  );
};

export default CategoryNavigationButton;
