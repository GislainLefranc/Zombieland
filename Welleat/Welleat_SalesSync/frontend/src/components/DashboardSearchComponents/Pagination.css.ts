/**
 * Fichier : src/styles/YourResponsiveFile.css.ts
 */
import { style } from '@vanilla-extract/css';

export const pendingMessage = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#ffcf01',
  color: 'black',
  padding: '1rem',
  borderRadius: '5px',

  '@media': {
    'screen and (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.5rem',
    },
    'screen and (max-width: 480px)': {
      padding: '0.5rem',
      fontSize: '0.9rem',
    },
  },
});

export const pagination = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
  margin: '1rem 0',

  '@media': {
    'screen and (max-width: 600px)': {
      flexDirection: 'column',
      gap: '0.5rem',
    },
  },
});

export const paginationSpan = style({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#333',

  '@media': {
    'screen and (max-width: 600px)': {
      fontSize: '0.9rem',
    },
  },
});
