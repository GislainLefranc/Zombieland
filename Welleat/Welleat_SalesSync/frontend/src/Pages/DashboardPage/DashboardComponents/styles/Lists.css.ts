// src/components/DashboardComponents/styles/Lists.css.ts

import { style } from '@vanilla-extract/css';

/**
 * Conteneur de la liste/table
 */
export const listContainer = style({
  width: '100%',
  overflowX: 'auto',
  marginTop: '1rem',
  marginBottom: '1rem',
});

/**
 * Table principale
 */
export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#fff',
  borderRadius: '5px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  fontSize: '1rem',
});

/**
 * Lignes du tableau
 */
export const tableRow = style({
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#f1f1f1',
  },
  selectors: {
    '&:nth-child(even)': {
      backgroundColor: '#fafafa',
    },
  },
});

/**
 * Cellules d’en-tête (sauf ID sticky)
 */
export const tableHeaderCell = style({
  padding: '0.8rem',
  textAlign: 'center',
  borderBottom: '1px solid #ccc',
  backgroundColor: '#f4f4f4',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
});

/**
 * Cellules de données
 */
export const tableCell = style({
  padding: '0.8rem',
  textAlign: 'center',
  borderBottom: '1px solid #ddd',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

/**
 * Colonne "Sélection" (checkbox)
 */
export const columnCheckbox = style({
  width: '70px',
  textAlign: 'center',
  backgroundColor: '#f4f4f4',
  position: 'sticky',
  left: 0,
  zIndex: 3,
  borderRight: '1px solid #ccc',
});

/**
 * Checkbox elle-même
 */
export const checkboxInput = style({
  cursor: 'pointer',
});

/**
 * En-tête de la colonne ID sticky
 */
export const columnIdHeader = style({
  width: '50px',
  textAlign: 'center',
  backgroundColor: '#f4f4f4',
  position: 'sticky',
  left: '60px', // Ajuster pour coller à la largeur de la checkbox
  zIndex: 3,
  borderRight: '1px solid #ccc',
  fontWeight: 'bold',
});

/**
 * Cellule ID sticky
 */
export const columnId = style({
  width: '50px',
  textAlign: 'center',
  backgroundColor: '#fff',
  position: 'sticky',
  left: '60px', // même offset
  zIndex: 2,
  borderRight: '1px solid #ccc',
  fontWeight: 'bold',
});

export const error = style({
  color: 'red',
});
