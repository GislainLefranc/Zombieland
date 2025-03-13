// Dossier : src/components/Common/Tabs (ou dossier similaire)
// Fichier : FilterBar.tsx
// Ce composant affiche une barre de filtres permettant de rechercher et, éventuellement, filtrer d'autres critères.
// Actuellement, seul le champ de recherche est actif.

import React from 'react';
import * as styles from './FilterBar.css';
import { Filters } from './../../../../../types';

interface FilterBarProps {
  filters: Filters;            // Objet contenant les filtres appliqués
  onChange: (filters: Filters) => void; // Callback appelé lors d'un changement de filtre
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  /**
   * Gère le changement d'un champ de filtre et met à jour l'objet filters.
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className={styles.filterBar}>
      <input
        type="text"
        name="search"
        placeholder="Rechercher..."
        value={filters.search}
        onChange={handleInputChange}
        className={styles.searchInput}
      />

      {/* Les autres filtres sont actuellement commentés, à réactiver si besoin */}
      {/*
      <select
        name="type"
        value={filters.type}
        onChange={handleInputChange}
        className={styles.selectInput}
      >
        <option value="all">Tous les types</option>
        <option value="type1">Type 1</option>
        <option value="type2">Type 2</option>
      </select>

      <select
        name="status"
        value={filters.status}
        onChange={handleInputChange}
        className={styles.selectInput}
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actif</option>
        <option value="inactive">Inactif</option>
      </select>

      <select
        name="date"
        value={filters.date}
        onChange={handleInputChange}
        className={styles.selectInput}
      >
        <option value="all">Toutes les dates</option>
        <option value="today">Aujourd'hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois-ci</option>
      </select>
      */}
    </div>
  );
};
