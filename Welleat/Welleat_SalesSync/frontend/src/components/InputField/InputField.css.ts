// src/components/InputField/InputField.css.ts

import { style } from '@vanilla-extract/css';

// Conteneur principal pour InputField
export const inputFieldContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1.5rem',
  width: '100%',
  maxWidth: '600px',
  gap: '1rem',
  boxSizing: 'border-box',
  '@media': {
    '(max-width: 1270px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      maxWidth: '500px',
    },
    '(max-width: 710px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      maxWidth: '100%',
    },
  },
});

// Style pour le label
export const inputLabel = style({
  color: '#ffffff',
  fontSize: '1.5rem',
  textAlign: 'left',

  flex: '0 0 250px',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.3rem',
      flex: '0 0 100%',
      marginBottom: '0.5rem',
    },
    '(max-width: 710px)': {
      fontSize: '1.1rem',
      flex: '0 0 100%', 
      marginBottom: '0.5rem',
    },
  },
});

// Nouvelle classe pour le label de simulation
export const simulationLabel = style({
  fontWeight: 'bold', 
  fontSize: '1.5rem', 
  color: '#ffffff', 
  flex: '0 0 300px',
  width: '300px',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.5rem',
      flex: '0 0 250px',
      width: '250px',
    },
    '(max-width: 710px)': {
      fontSize: '1.3rem',
      flex: '0 0 100%',
      width: '100%',
    },
  },
});

// Style pour les champs de saisie de simulation
export const simulationInput = style({
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '1.5rem',
  flex: '1 0 150px',
  width: '150px', 
  boxSizing: 'border-box',
  transition: 'background-color 0.3s, color 0.3s',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.3rem',
      flex: '1 0 120px',
      width: '120px',
    },
    '(max-width: 710px)': {
      fontSize: '1.1rem',
      flex: '1 0 100%', 
      width: '100%',
    },
  },
});

// Style pour les champs de saisie éditables (Profile)
export const profileInputEditable = style({
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '0.5rem',
  fontSize: '1.5rem',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
  color: '#000000',
  cursor: 'text',
  transition: 'background-color 0.3s, color 0.3s',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.3rem',
    },
    '(max-width: 710px)': {
      fontSize: '1.1rem',
    },
  },
});

// Style pour les champs de saisie en lecture seule (Profile)
export const profileInputReadOnly = style({
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '0.5rem',
  fontSize: '1.5rem',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
  color: '#aca8a8',
  cursor: 'not-allowed',
  transition: 'background-color 0.3s, color 0.3s',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.3rem',
    },
    '(max-width: 710px)': {
      fontSize: '1.1rem',
    },
  },
});

export const inputError = style({
  border: '2px solid red',
  backgroundColor: 'rgba(255, 0, 0, 0.05)',
});

export const required = style({
  color: 'red',
  marginLeft: '0.5rem',
});

export const errorMessage = style({
  color: 'red',
  fontSize: '1.2rem',
  marginTop: '0.5rem',
});
