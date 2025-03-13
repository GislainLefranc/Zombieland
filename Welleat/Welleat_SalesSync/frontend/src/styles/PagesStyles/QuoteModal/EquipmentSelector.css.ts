// EquipmentSelector.css.ts
import { style } from '@vanilla-extract/css';

/**
 * Conteneur principal du sélecteur d'équipements.
 */
export const container = style({
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginBottom: '1rem',
});

/**
 * Groupe de champs pour le sélecteur et le bouton d'ajout.
 */
export const formGroup = style({
  marginBottom: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
});

/**
 * Style pour le sélecteur (select).
 */
export const select = style({
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
});

/**
 * Style pour l'input de quantité.
 */
export const input = style({
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '60px',
});

/**
 * Style pour la checkbox.
 */
export const checkbox = style({
  marginLeft: '0.5rem',
});

/**
 * Style pour le bouton "Ajouter".
 */
export const addButton = style({
  padding: '0.5rem 1rem',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '0.5rem',
});

/**
 * Style pour la table qui liste les équipements sélectionnés.
 */
export const equipmentList = style({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
});

/**
 * Style pour les cellules d'en-tête de la table.
 */
export const tableHeaderCell = style({
  textAlign: 'left',
  padding: '0.5rem',
});

/**
 * Style pour les cellules de la table.
 */
export const tableCell = style({
  padding: '0.5rem',
});

/**
 * Style pour chaque ligne de la table.
 */
export const tableRow = style({
  borderBottom: '1px solid #ddd',
});

/**
 * Style pour le bouton "Retirer".
 */
export const removeButton = style({
  padding: '0.25rem 0.5rem',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '0.5rem',
});
