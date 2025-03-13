/**
 * Dossier : src/DashboardComponents
 * Fichier : ButtonContainer.tsx
 *
 * Ce fichier définit le composant ButtonContainer qui affiche des boutons
 * pour changer le mode d'affichage, ouvrir le menu de filtrage et lancer des actions.
 */

import React, { useState } from 'react';
import * as styles from './styles/ButtonContainer.css';
import Button from '../../../components/Button/Button';

interface ButtonContainerProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  selectedItems: number[];
  isAdmin: boolean;
  onDeleteSelected: () => void;
  onAssign: () => void;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  viewMode,
  setViewMode,
  selectedItems,
  isAdmin,
  onDeleteSelected,
  onAssign,
}) => {
  // État pour l'ouverture du menu de filtrage sur petits écrans
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Bascule l'ouverture/fermeture du menu de filtrage
  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className={styles.buttonContainer}>
      {/* Boutons principaux pour changer de mode d'affichage */}
      <div className={styles.mainButtons}>
        <Button
          variant="primary"
          text="Afficher les Établissements"
          onClick={() => setViewMode('companies')}
          size="small"
        />
        <Button
          variant="primary"
          text="Afficher les Interlocuteurs"
          onClick={() => setViewMode('interlocutors')}
          size="small"
        />
        <Button
          variant="primary"
          text="Afficher les Interlocuteurs Indépendants"
          onClick={() => setViewMode('independentInterlocutors')}
          size="small"
        />
        {isAdmin && (
          <Button
            variant="primary"
            text="Membre Welleat"
            onClick={() => setViewMode('users')}
            size="small"
          />
        )}
      </div>

      {/* Bouton pour afficher le menu sur petits écrans */}
      <Button
        variant="primary"
        text="Affichage du menu"
        onClick={handleFilterToggle}
        size="small"
        className={styles.filterButton}
      />

      {/* Menu de filtrage déroulant */}
      {isFilterOpen && (
        <div className={styles.filterMenu}>
          <Button
            variant="primary"
            text="Afficher les Établissements"
            onClick={() => {
              setViewMode('companies');
              setIsFilterOpen(false);
            }}
            size="small"
          />
          <Button
            variant="primary"
            text="Afficher les Interlocuteurs"
            onClick={() => {
              setViewMode('interlocutors');
              setIsFilterOpen(false);
            }}
            size="small"
          />
          <Button
            variant="primary"
            text="Afficher les Interlocuteurs Indépendants"
            onClick={() => {
              setViewMode('independentInterlocutors');
              setIsFilterOpen(false);
            }}
            size="small"
          />
          {isAdmin && (
            <Button
              variant="primary"
              text="Membre Welleat"
              onClick={() => {
                setViewMode('users');
                setIsFilterOpen(false);
              }}
              size="small"
            />
          )}
        </div>
      )}

      {/* Boutons d'action : supprimer et assigner */}
      {selectedItems.length > 0 && (
        <>
          <Button
            variant="danger"
            text="Supprimer"
            onClick={onDeleteSelected}
            size="small"
          />
          <Button
            variant="assignDashboard"
            text="Assigner"
            onClick={onAssign}
            size="small"
          />
        </>
      )}
    </div>
  );
};

export default ButtonContainer;
