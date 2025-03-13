// Dossier : src/Pages/ErrorPage | Fichier : ErrorPage.css.ts

import { style } from '@vanilla-extract/css';

// Style du conteneur rectangle pour les pages d'erreur
export const rectangle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#13674E',
  borderRadius: '2rem',
  padding: '1rem 15rem',
  maxWidth: '90vw',
  minWidth: '300px',
  boxSizing: 'border-box',
  color: '#ffffff',
  '@media': {
    '(max-width: 1024px)': { padding: '1rem 5rem' },
    '(max-width: 768px)': { padding: '1rem 2rem' },
    '(max-width: 480px)': { padding: '1rem 1rem' },
  },
});

// Style pour l'image d'erreur
export const errorImage = style({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '1rem',
});

// Style pour afficher les détails de l'erreur
export const errorDetails = style({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '1rem',
  margin: '1rem 0',
  borderRadius: '8px',
  maxWidth: '100%',
  overflowX: 'auto',
  color: '#dc3545',
  fontSize: '0.875rem',
  fontFamily: 'monospace',
});

// Style pour le conteneur des boutons d'action
export const errorActions = style({
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '@media': {
    '(max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
});
