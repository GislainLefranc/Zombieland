// Dossier : src/components/Common/Tabs
// Fichier : Tabs.css.ts
// Ce fichier gère les styles (Vanilla Extract) pour le composant Tabs


import { style } from '@vanilla-extract/css';
import { vars } from '../../../../../styles/variables.css';

/* ----------------------------------------------------------------------------
   Conteneur des onglets
   ----------------------------------------------------------------------------*/
export const tabsContainer = style({
  display: 'flex',
  borderBottom: `2px solid ${vars.colors.border}`,
  backgroundColor: '#13674e', // Fond vert foncé
});

/* ----------------------------------------------------------------------------
   Onglet individuel
   ----------------------------------------------------------------------------*/
export const tab = style({
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#ffffff', 
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',

  ':hover': {
    backgroundColor: '#0f593e',
  },

  '@media': {
    'screen and (max-width: 480px)': {
      padding: '0.5rem 1rem',
      fontSize: '0.9rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   Onglet actif
   ----------------------------------------------------------------------------*/
export const activeTab = style({
  backgroundColor: '#0f593e', 
  fontWeight: 'bold',
});
