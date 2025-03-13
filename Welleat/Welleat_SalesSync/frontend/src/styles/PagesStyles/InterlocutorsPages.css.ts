// src/styles/PagesStyles/InterlocutorsPages.css.ts

import { style } from '@vanilla-extract/css';

/* Conteneur du formulaire d'interlocuteur */
export const interlocutorForm = style({
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: '#13674e',
  borderRadius: '10px',
  boxSizing: 'border-box',
  color: '#ffffff',
});

/* Titre du formulaire */
export const formTitle = style({
  textAlign: 'center',
  marginBottom: '2rem',
  fontSize: '2rem',
  color: '#ffffff',
});

/* Styles des groupes d'entrée */
export const inputGroup = style({
  marginBottom: '1.5rem',
});

export const formInput = style({
  width: '100%',
  padding: '0.5rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
  color: '#000000',
});

export const textarea = style({
  minHeight: '100px',
  resize: 'vertical',
});

/* Conteneur des boutons */
export const buttonsContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '2rem',
  gap: '0.5rem',
});

/* Bouton Sauvegarder */
export const saveButton = style({
  flex: 1,
  margin: 0,
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#2ecc71',
  color: '#ffffff',
  transition: 'background-color 0.3s ease',
  selectors: {
    '&:hover': {
      backgroundColor: '#27ae60',
    },
  },
});

/* Bouton Annuler */
export const cancelButton = style({
  flex: 1,
  margin: 0,
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#e74c3c',
  color: '#ffffff',
  transition: 'background-color 0.3s ease',
  selectors: {
    '&:hover': {
      backgroundColor: '#c0392b',
    },
  },
});

/* Bouton Réinitialiser */
export const resetButton = style({
  flex: 1,
  margin: 0,
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#D9534F',
  color: '#ffffff',
  transition: 'background-color 0.3s ease',
  selectors: {
    '&:hover': {
      backgroundColor: '#c9302c',
    },
  },
});

/* Conteneur pour un interlocuteur (si besoin d'en afficher plusieurs) */
export const interlocutorContainer = style({
  border: '1px solid #ccc',
  padding: '1rem',
  marginBottom: '1rem',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
});

/* Bouton de suppression d’un interlocuteur */
export const removeButton = style({
  backgroundColor: '#e74c3c',
  color: '#ffffff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  selectors: {
    '&:hover': {
      backgroundColor: '#c0392b',
    },
  },
});

/* Bouton pour ajouter un interlocuteur */
export const addButton = style({
  backgroundColor: '#3498db',
  color: '#ffffff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  selectors: {
    '&:hover': {
      backgroundColor: '#e0bc04',
    },
  },
});

/* Bouton de soumission (exemple) */
export const submitButton = style({
  backgroundColor: '#2ecc71',
  color: '#ffffff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  selectors: {
    '&:hover': {
      backgroundColor: '#27ae60',
    },
  },
});
