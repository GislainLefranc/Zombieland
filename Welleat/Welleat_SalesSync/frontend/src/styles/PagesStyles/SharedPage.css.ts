// src/styles/SharedPage.css.ts

import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/variables.css'; 

export const mainContainer = style({
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

export const header = style({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginBottom: vars.spacing.large,
  gap: '1rem',
});

export const actionButtonsContainer = style({
  display: 'flex',
  gap: '1rem',
  '@media': {
    'screen and (max-width: 480px)': {
      flexDirection: 'column',
      gap: '0.5rem',
    },
  },
});

export const sendButton = style({
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

export const sendIcon = style({
  marginRight: '0.5rem',
  width: '20px',
  height: '20px',
  objectFit: 'contain',
});