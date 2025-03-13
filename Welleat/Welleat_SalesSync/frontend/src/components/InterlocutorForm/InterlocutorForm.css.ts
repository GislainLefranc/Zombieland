// src/components/InterlocutorForm.css.ts

import { style, styleVariants } from '@vanilla-extract/css';

export const interlocutorForm = style({
  padding: '1rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const formTitle = style({
  fontSize: '1.5rem',
  marginBottom: '1rem',
  textAlign: 'center',
});

export const inputGroup = style({
  marginBottom: '1rem',
  display: 'flex',
  flexDirection: 'column',
});

export const label = style({
  marginBottom: '0.5rem',
  fontWeight: 'bold',
});

export const input = style({
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem',
});

export const buttonsContainer = style({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',
});

export const buttonGroup = style({
  display: 'flex',
  gap: '1rem',
});

export const button = style({
  flex: 1,
  padding: '0.5rem 1rem',
  backgroundColor: '#ffcf01',
  color: '#000000',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
  selectors: {
    '&:hover': {
      backgroundColor: '#e0bc04',
    },
    '&.active': {
      backgroundColor: '#e0bc04',
    },
  },
});

// Styles spécifiques pour les boutons d'assignation
export const buttonsContainerButtonGroup = style({
  display: 'flex',
  gap: '1rem',
});

export const assignButton = style({
  flex: 'none',
  width: 'auto',
});
