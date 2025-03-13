// src/Pages/simulationPage/simulationPage.css.ts

import { style } from '@vanilla-extract/css';

// Classe pour augmenter la largeur du label
export const wideLabel = style({
  flex: '0 0 500px',
  width: '5px',
  '@media': {
    '(max-width: 1270px)': {
      flex: '0 0 100%',
      width: '100%',
    },
    '(max-width: 710px)': {
      flex: '0 0 100%',
      width: '100%',
    },
  },
});

// Classe pour réduire la largeur de l'input
export const narrowInput = style({
  flex: '1 0 5px',
  width: '100px',
  textAlign: 'right',
  marginLeft: 'auto',
  '@media': {
    '(max-width: 1270px)': {
      flex: '1 0 50px',
      width: '100px',
      marginLeft: 'auto',
    },
    '(max-width: 710px)': {
      flex: '1 0 50px',
      width: '70px',
      marginLeft: 'auto',
    },
  },
});

// Titre principal
export const simulationTitle = style({
  color: 'white',
  marginBottom: '1.5rem',
  marginTop: '1.5rem',
  textAlign: 'center',
  fontSize: '2rem',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.8rem',
      marginBottom: '1.2rem',
      marginTop: '1.2rem',
    },
    '(max-width: 710px)': {
      fontSize: '1.5rem',
      marginBottom: '1rem',
      marginTop: '1rem',
    },
  },
});

// Section du formulaire
export const simulationInputSection = style({
  width: '70%',
  margin: '0 auto 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
  '@media': {
    '(max-width: 1270px)': {
      width: '80%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    '(max-width: 710px)': {
      width: '95%',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '1rem',
    },
  },
});

// Section des résultats
export const simulationResultSection = style({
  marginTop: '2rem',
  textAlign: 'center',
  color: 'white',
  padding: '1rem',
  width: '100%',
  boxSizing: 'border-box',
  '@media': {
    '(max-width: 1270px)': {
      marginTop: '1.5rem',
      padding: '0.8rem',
    },
    '(max-width: 710px)': {
      marginTop: '1rem',
      padding: '0.5rem',
    },
  },
});

// Titres dans les résultats
export const simulationResultTitle = style({
  fontSize: '1.5rem',
  color: 'white',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row', 
  flexWrap: 'nowrap', 
  gap: '0.3rem',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.4rem',
      gap: '0.2rem',
    },
    '(max-width: 710px)': {
      fontSize: '1.2rem',
      flexWrap: 'wrap', 
      gap: '0.1rem',
    },
  },
});

// Logo inline
export const simulationInlineLogo = style({
  width: '80px',
  height: 'auto',
  margin: '0', 
  paddingBottom: '0', 
  '@media': {
    '(max-width: 1270px)': {
      width: '70px',
    },
    '(max-width: 710px)': {
      width: '60px',
    },
  },
});

// Classe pour le conteneur du logo et du texte "Welleat"
export const simulationLogoWelleat = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem', 
  justifyContent: 'center',
  '@media': {
    '(max-width: 710px)': {
      flexDirection: 'column',
      gap: '0.2rem',
    },
  },
});

// Groupe des résultats
export const simulationResultGroup = style({
  textAlign: 'left',
  margin: '0.5rem auto',
  fontSize: '1.5rem',
  maxWidth: '600px',
  width: '100%',
  boxSizing: 'border-box',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.3rem',
      margin: '0.5rem auto',
    },
    '(max-width: 710px)': {
      fontSize: '1.1rem',
      margin: '0.3rem auto',
    },
  },
});

// Valeurs des résultats
export const simulationResultValue = style({
  marginLeft: '5rem',
  '@media': {
    '(max-width: 1270px)': {
      marginLeft: '3rem',
    },
    '(max-width: 710px)': {
      marginLeft: '1.5rem',
    },
  },
});

// Solution Welleat
export const simulationSolutionW = style({
  fontSize: '1.5rem',
});

// Note dans les résultats
export const simulationNote = style({
  marginBottom: '1.5rem',
  fontSize: '1rem',
  color: '#ddd',
  textAlign: 'right',
  paddingLeft: '1rem',
  '@media': {
    '(max-width: 1270px)': {
      paddingLeft: '0.8rem',
      fontSize: '0.85rem',
    },
    '(max-width: 710px)': {
      paddingLeft: '0.5rem',
      fontSize: '0.8rem',
    },
  },
});

// Performance Welleat
export const simulationWelleaPerformance = style({
  marginTop: '2rem',
  '@media': {
    '(max-width: 1270px)': {
      marginTop: '1.5rem',
    },
    '(max-width: 710px)': {
      marginTop: '1rem',
    },
  },
});

// Titre de performance
export const simulationPerformanceTitle = style({
  fontSize: '1.5rem',
  color: 'white',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.4rem',
      flexDirection: 'column',
    },
    '(max-width: 710px)': {
      fontSize: '1.2rem',
      flexDirection: 'column',
    },
  },
});

// Conteneurs de boutons
export const simulationButtonsContainer = style({
  marginTop: '2rem',
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
  '@media': {
    '(max-width: 1270px)': {
      marginTop: '1.5rem',
    },
    '(max-width: 710px)': {
      marginTop: '1rem',
      flexDirection: 'column', 
      alignItems: 'center',
    },
  },
});

export const consentCheckbox = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  '@media': {
    '(max-width: 710px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.3rem',
    },
  },
});
