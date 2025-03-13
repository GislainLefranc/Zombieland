import { style, globalStyle } from '@vanilla-extract/css';

export const buttonContainer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',

  '@media': {
    'screen and (max-width: 480px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
});

export const mainButtons = style({
  display: 'flex',
  gap: '1rem',

  '@media': {
    'screen and (max-width: 768px)': {
      display: 'none',
    },
  },
});

export const filterButton = style({
  display: 'none',
  backgroundColor: '#059A6D',
  color: '#FFFFFF',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '@media': {
    'screen and (max-width: 768px)': {
      display: 'block',
      width: '100%',
    },
  },
  ':hover': {
    backgroundColor: '#059A6D',
  },
});

export const filterMenu = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: '0.5rem',
  width: '100%',
});

// Utiliser globalStyle pour les boutons dans le menu
globalStyle(`${filterMenu} button`, {
  width: '100%',
  '@media': {
    'screen and (max-width: 768px)': {
      width: '100%',
    },
  },
});
