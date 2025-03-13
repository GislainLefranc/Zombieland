import { style } from '@vanilla-extract/css';

export const userInfo = style({});
export const selectedInterlocuteurs = style({});
export const selectedInterlocuteur = style({});
export const removeButton = style({});
export const buttons = style({});

/**
 * Overlay qui recouvre toute la fenêtre.
 */
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

/**
 * Conteneur principal de la modal.
 */
export const content = style({
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '500px',
  maxHeight: '80vh',
  overflowY: 'auto',
  '@media': {
    'screen and (min-width: 1024px)': {
      width: '800px',
    },
    'screen and (max-width: 480px)': {
      width: '95%',
      borderRadius: '4px',
      padding: '15px',
    },
  },
});

/**
 * En-tête de la modal (fond vert, logo et titre).
 */
export const header = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#13674e',
  padding: '20px',
  color: '#fff',
  marginBottom: '20px',
  '@media': {
    'screen and (max-width: 768px)': {
      padding: '15px',
      marginBottom: '15px',
    },
    'screen and (max-width: 480px)': {
      padding: '10px',
      marginBottom: '10px',
    },
  },
});

/**
 * Logo affiché dans l’en-tête.
 */
export const logo = style({
  width: '100px',
  height: 'auto',
  '@media': {
    'screen and (max-width: 768px)': {
      width: '80px',
    },
    'screen and (max-width: 480px)': {
      width: '70px',
    },
  },
});

/**
 * Bouton de fermeture (X) en haut à droite.
 */
export const closeBtn = style({
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#FFC107',
  '@media': {
    'screen and (max-width: 768px)': {
      top: '8px',
      right: '8px',
      fontSize: '1.3rem',
    },
    'screen and (max-width: 480px)': {
      top: '6px',
      right: '6px',
      fontSize: '1.1rem',
    },
  },
});

/**
 * Titre principal de la modal.
 */
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

/**
 * Style du formulaire qui organise les éléments en colonne.
 */
export const form = style({
  display: 'flex',
  flexDirection: 'column',
});

/**
 * Style des sections internes
 */
export const section = style({
  marginBottom: '16px',
  '@media': {
    'screen and (max-width: 480px)': {
      marginBottom: '12px',
    },
  },
});

/**
 * Style pour le titre d'une section.
 */
export const sectionTitle = style({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '0.75rem',
  borderBottom: '1px solid #ddd',
  paddingBottom: '0.5rem',
  color: '#555',
  '@media': {
    'screen and (max-width: 480px)': {
      fontSize: '1.1rem',
      marginBottom: '0.5rem',
      paddingBottom: '0.4rem',
    },
  },
});

/**
 * Style pour les groupes de champs (label + input, select, etc.).
 */
export const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '8px',
  '@media': {
    'screen and (max-width: 480px)': {
      marginBottom: '6px',
    },
  },
});

/**
 * Style des labels.
 */
export const label = style({
  fontWeight: 'bold',
  marginBottom: '0.4rem',
  color: '#333',
  fontSize: '0.9rem',
  '@media': {
    'screen and (max-width: 480px)': {
      fontSize: '0.8rem',
      marginBottom: '0.3rem',
    },
  },
});

/**
 * Style pour les sélecteurs (select).
 */
export const select = style({
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '0.9rem',
  '@media': {
    'screen and (max-width: 480px)': {
      padding: '6px',
      fontSize: '0.8rem',
    },
  },
});

/**
 * Style pour les champs input.
 */
export const input = style({
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '0.9rem',
  '@media': {
    'screen and (max-width: 480px)': {
      padding: '6px',
      fontSize: '0.8rem',
    },
  },
});

/**
 * Style pour les groupes d'éléments (checkbox, etc.).
 */
export const checkboxGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  '@media': {
    'screen and (max-width: 480px)': {
      gap: '8px',
    },
  },
});

/**
 * Style pour afficher un prix calculé (ex. résumé).
 * Ce style reste fixe afin de conserver la lisibilité des informations en gris.
 */
export const calculatedPrice = style({
  fontWeight: 'bold',
  fontSize: '1.2rem',
});

/**
 * Bouton d'annulation.
 */
export const cancelButton = style({
  padding: '10px 20px',
  backgroundColor: '#ccc',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  '@media': {
    'screen and (max-width: 480px)': {
      padding: '8px 16px',
      fontSize: '0.8rem',
    },
  },
});

/**
 * Bouton de validation / soumission.
 */
export const submitButton = style({
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  '@media': {
    'screen and (max-width: 480px)': {
      padding: '8px 16px',
      fontSize: '0.8rem',
    },
  },
});

/**
 * Classe pour un texte plus petit (pour certains éléments à affiner).
 */
export const smallText = style({
  fontSize: '0.9rem',
  color: '#555',
  '@media': {
    'screen and (max-width: 480px)': {
      fontSize: '0.8rem',
    },
  },
});

/**
 * Classe pour une marge supérieure réduite.
 */
export const mtSmall = style({
  marginTop: '0.5rem',
});

/**
 * Classe pour un retrait gauche réduit.
 */
export const mlSmall = style({
  marginLeft: '1.2rem',
});

/**
 * Classe pour les éléments d'information en gris (taille fixe).
 */
export const infoText = style({
  fontSize: '1rem',
  color: '#666',
});
