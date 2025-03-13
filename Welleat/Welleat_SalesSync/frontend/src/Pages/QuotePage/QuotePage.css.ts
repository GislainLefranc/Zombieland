// src/Pages/QuotePage/QuotePage.css.ts

import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/variables.css';

export const dashboardContainer = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  boxSizing: 'border-box',
  minHeight: '100vh',
  backgroundColor: vars.colors.backgroundSecondary,
  '@media': {
    'screen and (max-width: 1270px)': {
      padding: vars.spacing.medium,
    },
    'screen and (max-width: 710px)': {
      padding: vars.spacing.small,
    },
  },
});

// Style pour les boutons d'action
export const actionButtonsContainer = style({
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-start',
  '@media': {
    'screen and (max-width: 480px)': {
      flexDirection: 'column',
      gap: '0.5rem',
    },
  },
});

// Style pour le bouton "Envoyer par Email"
export const sendQuoteButton = style({
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  backgroundColor: '#28a745', 
  color: '#ffffff',
  border: 'none',
  borderRadius: vars.borderRadius.small,
  cursor: 'pointer',
  fontSize: vars.fontSize.medium,
  transition: 'background-color 0.3s ease',
  ':hover': {
    backgroundColor: '#218838',
  },
  '@media': {
    'screen and (max-width: 480px)': {
      width: '100%',
      justifyContent: 'center',
    },
  },
});

// Style pour l'icône d'envoi
export const sendIcon = style({
  marginRight: '0.5rem',
  width: '20px',
  height: '20px',
  objectFit: 'contain',
});
