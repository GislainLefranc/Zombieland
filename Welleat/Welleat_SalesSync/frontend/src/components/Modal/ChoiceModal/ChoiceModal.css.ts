import { style } from '@vanilla-extract/css';
import { m } from 'framer-motion';

/**
 * Optionnel : si vous n’avez pas déjà un utilitaire FlexCenter, définissez-le ici
 */
const flexCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

/* ----------------------------------------------------------------------------
   Overlay de la modale (fond semi‐opaque)
---------------------------------------------------------------------------- */
export const simulationModalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
});

export const simulationModalContent = style({
  backgroundColor: '#13674E',
  padding: '2rem',
  borderRadius: '10px',
  position: 'relative',
  width: '100%',
  maxWidth: '600px',
  margin: '1rem auto', // Centrage horizontal avec une marge minimale verticale
  '@media': {
    'screen and (max-width: 768px)': {
      padding: '0.8rem',
      margin: '1rem auto',
      width: 'calc(100% - 2rem)', // Garde un espace d'au moins 1rem à gauche et à droite
    },
    'screen and (max-width: 480px)': {
      padding: '0.5rem',
      margin: '1rem auto',
      width: 'calc(100% - 2rem)', // Idem pour les très petits écrans
    },
  },
});


export const simulationModalCloseBtn = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'none',
  border: 'none',
  fontSize: '1.8rem',
  cursor: 'pointer',
  color: '#e0bc04',
});

/* ----------------------------------------------------------------------------
   Header de la modale (bandeau vert + logo + titre)
---------------------------------------------------------------------------- */
export const modalHeader = style({
  backgroundColor: '#13674e',
  color: '#ffffff',
  marginBottom: '1rem',
  borderRadius: '6px',
  padding: '1rem',
  textAlign: 'center',
  ...flexCenter,
  flexDirection: 'column',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '0.8rem',
    },
    'screen and (max-width: 480px)': {
      padding: '0.5rem',
    },
  },
});

export const modalLogo = style({
  maxHeight: '60px', // Hauteur maximale du logo
  marginBottom: '0.5rem',
});

export const modalTitle = style({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: 0,
  color: '#ffffff', // Texte blanc
  textAlign: 'center',

  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '1.2rem',
    },
    'screen and (max-width: 480px)': {
      fontSize: '1rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   Exemple de style si vous l’utilisez encore ailleurs
---------------------------------------------------------------------------- */
export const simulationModalTitle = style({
  marginBottom: '1rem',
  fontSize: '1.8rem',
  textAlign: 'center',
});

/* ----------------------------------------------------------------------------
   Boutons, messages et autres styles partagés
---------------------------------------------------------------------------- */
export const simulationModalMessage = style({
  color: '#ffffff', 
  marginBottom: '2rem',
  textAlign: 'center',
});

export const modalButtons = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1.5rem',
});


/* ----------------------------------------------------------------------------
   (Le reste de vos styles utilisés par la seconde modale)
---------------------------------------------------------------------------- */
export const optionsContainer = style({
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '1.5rem'
});

export const companyList = style({
  marginTop: '1.5rem'
});

export const companyItem = style({
  padding: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: '5px',
  marginBottom: '0.5rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  ':hover': {
    backgroundColor: '#f0f0f0'
  }
});

export const companyForm = style({
  marginTop: '1.5rem'
});

export const formGroup = style({
  marginBottom: '1rem'
});

export const formLabel = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 'bold'
});

export const formInput = style({
  width: '100%',
  padding: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxSizing: 'border-box'
});

/* ----------------------------------------------------------------------------
   Champs email (exemple d’utilisation)
---------------------------------------------------------------------------- */
export const emailInputSection = style({
  marginBottom: '20px'
});

export const hiddenLabel = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: '0'
});

export const modalEmailInput = style({
  width: '70%',
  padding: '10px',
  marginRight: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  '@media': {
    'screen and (max-width: 480px)': {
      width: '94%',
      marginRight: '0',
      marginBottom: '10px',
    },
  },
});

export const modalEmailList = style({
  listStyle: 'none',
  padding: '0',
  margin: '20px 0'
});

export const modalEmailListItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '5px',
  marginBottom: '8px',
  backgroundColor: '#C9C9C9FF',
  borderRadius: '4px',
  ':hover': {
    backgroundColor: '#eee',
  },
});

/* ----------------------------------------------------------------------------
   Alternative overlay + contenu si besoin
---------------------------------------------------------------------------- */
export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
});

export const modalContent = style({
  backgroundColor: '#13674E',
  borderRadius: '10px',
  padding: '2rem',
  position: 'relative',
  maxWidth: '600px',
  width: '90%',
});

export const modalCloseBtn = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'none',
  border: 'none',
  fontSize: '1.8rem',
  cursor: 'pointer',
});

/* ----------------------------------------------------------------------------
   Boutons additionnels
---------------------------------------------------------------------------- */
export const addButton = style({
  padding: '0.5rem 1rem',
  backgroundColor: '#FFCF01',
  color: '#000',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  height: '45px',
});
