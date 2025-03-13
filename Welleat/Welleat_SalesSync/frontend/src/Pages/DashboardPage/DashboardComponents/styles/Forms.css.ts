// src/components/DashboardComponents/modals/styles/Forms.css.ts

import { style } from '@vanilla-extract/css';

// Style de base pour tous les formulaires
export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
});

// Style pour les labels
export const label = style({
  display: 'flex',
  flexDirection: 'column',
  fontWeight: 'bold',
  fontSize: '1rem',
  color: '#333',
});

// Style pour les inputs
export const input = style({
  padding: '0.5rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginTop: '0.5rem',
  ':focus': {
    borderColor: '#13674E',
    outline: 'none',
  },
});

// Style pour le bouton de soumission
export const submitButton = style({
  alignSelf: 'flex-end',
  marginTop: '1rem',
});
