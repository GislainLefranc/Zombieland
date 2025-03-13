/* 
  Dossier : styles/Modals
  Fichier : Modal.css.ts
*/

import { style } from '@vanilla-extract/css';
import { vars } from '../variables.css';
import { FaTimes } from 'react-icons/fa';  

/* Couche superposée qui couvre tout l'écran */
export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000,
});

/* Conteneur principal de la modale */
export const content = style({
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  width: '60%',       
  maxWidth: '600px',
  padding: '1.5rem',
  position: 'relative',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  overflow: 'auto',
  maxHeight: '90vh',

  /* Responsive breakpoints */
  '@media': {
    'screen and (max-width: 768px)': {
      width: '85%',
      padding: '1rem',
    },
    'screen and (max-width: 480px)': {
      width: '95%',
      borderRadius: '4px',
      padding: '0.8rem',
      margin: '0.5rem',
    },
  },
});

/* En-tête de la modale (fond vert, logo, etc.) */
export const header = style({
  backgroundColor: '#13674e',
  padding: '20px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '15px',
    },
    'screen and (max-width: 480px)': {
      padding: '10px',
    },
  },
});

/* Logo dans l'en-tête */
export const logo = style({
  maxWidth: '70px',
  height: 'auto',

  '@media': {
    'screen and (max-width: 768px)': {
      maxWidth: '60px',
    },
    'screen and (max-width: 480px)': {
      maxWidth: '50px',
    },
  },
});

/* Bouton de fermeture (X) */
export const closeBtn = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'none',
  border: 'none',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#FFC107',

  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '1.3rem',
      top: '0.8rem',
      right: '0.8rem',
    },
    'screen and (max-width: 480px)': {
      fontSize: '1.3rem',
      top: '0.6rem',
      right: '0.6rem',
    },
  },
});

/* Titre principal dans certaines modales */
export const title = style({
  fontSize: '1.6rem',
  margin: 0,
  color: '#ffffff',   
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '1.4rem',
    },
    'screen and (max-width: 480px)': {
      fontSize: '1.2rem',
    },
  },
});

export const message = style({
  fontSize: '1rem',
  color: '#666',
  margin: '0.5rem 0 1rem',
  textAlign: 'center',
});

/* Conteneur pour un formulaire générique */
export const form = style({
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '15px',
    },
    'screen and (max-width: 480px)': {
      padding: '10px',
    },
  },
});

/* Groupe de champs */
export const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1rem',

  '@media': {
    'screen and (max-width: 480px)': {
      marginBottom: '0.75rem',
    },
  },
});

/* Label masqué (accessibilité) */
export const hiddenLabel = style({
  position: 'absolute',
  left: '-10000px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
});

/* Champ input standard */
export const input = style({
  width: '100%',
  padding: '0.6rem',
  borderRadius: '4px',
  border: `1px solid ${vars.colors.border}`,
  fontSize: '1rem',
  ':focus': {
    borderColor: '#13674e',
    outline: 'none',
  },

  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '0.95rem',
    },
    'screen and (max-width: 480px)': {
      fontSize: '0.9rem',
      padding: '0.5rem',
    },
  },
});

/* Champ select standard */
export const select = style({
  padding: '0.6rem',
  border: `1px solid ${vars.colors.border}`,
  borderRadius: '5px',
  fontSize: '1rem',
  backgroundColor: '#fff',
  ':focus': {
    borderColor: '#13674e',
    outline: 'none',
  },

  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '0.95rem',
    },
    'screen and (max-width: 480px)': {
      fontSize: '0.9rem',
      padding: '0.5rem',
    },
  },
});

/* Champ textarea standard */
export const textarea = style({
  padding: '0.6rem',
  border: `1px solid ${vars.colors.border}`,
  borderRadius: '5px',
  fontSize: '1rem',
  ':focus': {
    borderColor: '#13674e',
    outline: 'none',
  },

  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '0.95rem',
    },
    'screen and (max-width: 480px)': {
      fontSize: '0.9rem',
      padding: '0.5rem',
    },
  },
});

/* Conteneur pour un groupement de boutons */
export const buttons = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '20px',
  padding: '0 20px 20px 20px',

  '@media': {
    'screen and (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: '0 15px 15px 15px',
    },
    'screen and (max-width: 480px)': {
      padding: '0 10px 10px 10px',
    },
  },
});

/* Info de prix (ex: "TTC : 10€") */
export const priceInfo = style({
  marginLeft: '3rem',
  fontSize: '0.9rem',
  color: '#666666',
  fontStyle: 'italic',

  '@media': {
    'screen and (max-width: 768px)': {
      marginLeft: '1rem',
    },
    'screen and (max-width: 480px)': {
      marginLeft: 0,
      textAlign: 'center',
      fontSize: '0.85rem',
    },
  },
});

/* Label standard */
export const label = style({
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#333',
});

/* Section encadrée */
export const section = style({
  padding: '1rem',
  border: `1px solid ${vars.colors.border}`,
  borderRadius: '4px',
  marginBottom: '1rem',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '0.75rem',
    },
    'screen and (max-width: 480px)': {
      padding: '0.5rem',
    },
  },
});

/* Titre d'une section (souvent fond coloré) */
export const sectionTitle = style({
  backgroundColor: '#ffc107',
  padding: '10px',
  borderRadius: '4px',
  color: '#000',
  marginBottom: '1rem',
  fontWeight: 'bold',
  textAlign: 'center',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '8px',
      fontSize: '1rem',
    },
    'screen and (max-width: 480px)': {
      padding: '6px',
      fontSize: '0.95rem',
    },
  },
});

/* Bloc d'infos utilisateur ou similaire */
export const userInfo = style({
  position: 'relative',
  padding: '1rem',
  backgroundColor: '#f5f5f5',
  border: `1px solid ${vars.colors.border}`,
  borderRadius: '4px',
  color: '#333',
  fontWeight: 'normal',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '0.75rem',
    },
    'screen and (max-width: 480px)': {
      padding: '0.5rem',
    },
  },
});

/* Liste pour éléments sélectionnés */
export const selectedList = style({
  marginTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',

  '@media': {
    'screen and (max-width: 480px)': {
      gap: '0.75rem',
    },
  },
});

/* Section pour affichage de totaux ou résumé */
export const totalSection = style({
  backgroundColor: '#f0f4f8',
  padding: '15px',
  borderRadius: '5px',
  textAlign: 'right',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginTop: '1rem',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '12px',
    },
    'screen and (max-width: 480px)': {
      padding: '10px',
    },
  },
});

/* Grille d'infos sur deux colonnes */
export const infoGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  margin: '1rem 0',

  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

/* Texte spécifique quand pas de donnée */
export const noData = style({
  color: '#666',
  fontStyle: 'italic',
});

/* Grille utilisée pour lister des options, etc. */
export const optionsGrid = style({
  gridColumn: '1 / -1',
  marginTop: '1rem',
});

/* Elément d'un récapitulatif / résumé */
export const summaryItem = style({
  marginBottom: '15px',
});

/* Section de résumé globale */
export const summarySection = style({
  backgroundColor: '#f0f4f8',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '16px',
    },
    'screen and (max-width: 480px)': {
      padding: '12px',
    },
  },
});

/* Petite info ou texte descriptif */
export const info = style({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
});

/* Carte d'un interlocuteur (bloc) */
export const interlocutorCard = style({
  padding: '1rem',
  backgroundColor: '#fff',
  border: `1px solid ${vars.colors.border}`,
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '0.75rem',
    },
    'screen and (max-width: 480px)': {
      padding: '0.5rem',
    },
  },
});


export const selectedInterlocuteurs = style({
  // styles
});

export const selectedInterlocuteur = style({
  // styles
});

export const removeButton = style({
  // styles
});

export const selectWithButtonContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
});

export const removeOptionButton = style({
  backgroundColor: '#FF0000A8',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.9em',
  ':hover': {
    backgroundColor: '#FF000071',
  },
  '@media': {
    '(max-width: 768px)': {
      borderRadius: '50%',
      width: '25px',
      height: '25px',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 'auto',
    }
  }
});