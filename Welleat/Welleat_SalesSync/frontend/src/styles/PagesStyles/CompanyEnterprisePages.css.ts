// Dossier : src/PagesStyles
// Fichier : CompanyEnterprisePages.css.ts
//
// Styles pour CompanyPage et EffectifWelleatPage

import { style } from '@vanilla-extract/css';
import { vars } from '../variables.css';

// -----------------------------
// Conteneur principal
// -----------------------------
export const mainContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  backgroundColor: '#E7E5E4', 
  padding: '2rem',
  borderRadius: '12px',
  maxWidth: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  '@media': {
    '(max-width: 1270px)': {
      padding: '1.5rem',
      gap: '1rem',
    },
    '(max-width: 710px)': {
      padding: '1rem',
      gap: '0.8rem',
    },
    '(max-width: 480px)': {
      padding: '0.8rem',
      gap: '0.5rem',
    },
  },
});

// -----------------------------
// Section
// -----------------------------
export const section = style({
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  marginBottom: '2rem',
  boxSizing: 'border-box',
  textAlign: 'center',
  
  '@media': {
    '(max-width: 1270px)': {
      padding: '1rem',
      marginBottom: '1.5rem',
    },
    '(max-width: 710px)': {
      padding: '0.8rem',
      marginBottom: '1rem',
    },
    '(max-width: 480px)': {
      padding: '0.6rem',
      marginBottom: '0.8rem',
    },
  },
});

export const sectionContent = style({
  textAlign: 'center',
  width: '100%',
});

export const buttonWrapper = style({
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',
  marginBottom: '1rem',
  padding: '0 1rem',
});

// -----------------------------
// Titre de sous-section
// -----------------------------
export const subsectionTitle = style({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#FFFFFF',
  textAlign: 'center',
  padding: '0.5rem',
  backgroundColor: vars.colors.modalBackground,
  borderRadius: '8px',
  marginBottom: '1rem',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.3rem',
      padding: '0.4rem',
    },
    '(max-width: 710px)': {
      fontSize: '1.1rem',
      padding: '0.35rem',
    },
    '(max-width: 480px)': {
      fontSize: '0.9rem',
      padding: '0.3rem',
    },
  },
});

// -----------------------------
// Conteneur du carrousel
// -----------------------------
export const carouselContainer = style({
  position: 'relative',
  width: '100%',
  maxWidth: '950px',
  margin: '0 auto',
  overflow: 'hidden',
  padding: '0 20px', 
  '@media': {
    '(max-width: 710px)': {
      padding: '0 10px',
    },
    '(max-width: 480px)': {
      padding: '0 5px',
    },
  },
});

export const card = style({
  flex: '0 0 280px',
  position: 'relative',
  padding: '15px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

export const carouselWrapper = style({
  display: 'flex',
  gap: '10px',
  transition: 'transform 0.3s ease-in-out',
  justifyContent: 'center',
});

// -----------------------------
// Bouton de suppression
// -----------------------------
export const deleteButton = style({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '20px',
  height: '20px',
  backgroundColor: vars.colors.delete,
  border: 'none',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#fff',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',
  ':hover': {
    backgroundColor: vars.colors.deleteHover,
  },
  '@media': {
    '(max-width: 1270px)': {
      width: '20px',
      height: '20px',
      fontSize: '0.9rem',
    },
    '(max-width: 710px)': {
      width: '18px',
      height: '18px',
      fontSize: '0.8rem',
    },
    '(max-width: 480px)': {
      width: '16px',
      height: '16px',
      fontSize: '0.75rem',
    },
  },
});

// -----------------------------
// Boutons de navigation du carrousel (correction appliquée)
// -----------------------------
export const carouselButton = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  backgroundColor: '#13674E',
  color: '#ffffff',
  border: 'none',
  cursor: 'pointer',
  fontSize: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  ':hover': {
    backgroundColor: '#0f503c',
  },
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
});

export const leftButton = style([
  carouselButton,
  {
    left: '5px' 
  }
]);

export const rightButton = style([
  carouselButton,
  {
    right: '5px'
  }
]);

// -----------------------------
// Section Simulations
// -----------------------------
export const simulationsSection = style({
  backgroundColor: '#FFFFFF',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '@media': {
    '(max-width: 1270px)': {
      padding: '1rem',
    },
    '(max-width: 710px)': {
      padding: '0.8rem',
    },
    '(max-width: 480px)': {
      padding: '0.7rem',
    },
  },
});

export const simulationsTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  overflowX: 'auto',
  '@media': {
    '(max-width: 710px)': {
      display: 'block',
      overflowX: 'scroll',
      whiteSpace: 'nowrap',
    },
  },
});

export const cardHeader = style({
  fontSize: '1.1rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textTransform: 'uppercase',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1rem',
    },
    '(max-width: 710px)': {
      fontSize: '0.9rem',
    },
    '(max-width: 480px)': {
      fontSize: '0.85rem',
    },
  },
});
export const cardDetails = style({
  fontSize: '0.9rem',
  lineHeight: '1.4',
});
export const tableHeader = style({
  backgroundColor: '#13674E',
  color: '#ffffff',
  fontWeight: 'bold',
  padding: '1rem',
  textAlign: 'center',
  '@media': {
    '(max-width: 1270px)': {
      padding: '0.8rem',
      fontSize: '0.95rem',
    },
    '(max-width: 710px)': {
      padding: '0.6rem',
      fontSize: '0.85rem',
    },
    '(max-width: 480px)': {
      padding: '0.5rem',
      fontSize: '0.8rem',
    },
  },
});

export const tableCell = style({
  border: '1px solid #ddd',
  padding: '0.8rem',
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#1e293b',
  '@media': {
    '(max-width: 1270px)': {
      padding: '0.6rem',
      fontSize: '0.85rem',
    },
    '(max-width: 710px)': {
      padding: '0.4rem',
      fontSize: '0.75rem',
    },
    '(max-width: 480px)': {
      padding: '0.35rem',
      fontSize: '0.7rem',
    },
  },
});

export const principalStar = style({
  position: 'absolute',
  top: '10px',
  left: '10px',
  color: '#FFCF01',
  fontSize: '20px',
  cursor: 'pointer',
});

export const starIcon = style({
  position: 'absolute',
  top: '10px',
  left: '10px',
  color: '#808080',
  fontSize: '20px',
  cursor: 'pointer',
});

export const nonInteractiveStar = style({
  cursor: 'default',
  opacity: '0.5',
});

export const tableRow = style({
  ':nth-child(even)': {
    backgroundColor: '#f9f9f9',
  },
  ':nth-child(odd)': {
    backgroundColor: '#ffffff',
  },
  ':hover': {
    backgroundColor: '#f1f1f1',
  },
});

// -----------------------------
// Section photo de profil
// -----------------------------
export const profilePhotoContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '1rem',
});

export const profilePhoto = style({
  width: '150px',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '50%',
  border: '4px solid #fff',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  '@media': {
    '(max-width: 1270px)': {
      width: '130px',
      height: '130px',
    },
    '(max-width: 710px)': {
      width: '100px',
      height: '100px',
    },
    '(max-width: 480px)': {
      width: '80px',
      height: '80px',
    },
  },
});

export const modifyPhotoButton = style({
  marginTop: '0.5rem',
  padding: '0.5rem 1rem',
  backgroundColor: vars.colors.primary,
  color: '#000000',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  ':hover': {
    backgroundColor: vars.colors.primaryHover,
  },
  '@media': {
    '(max-width: 1270px)': {
      padding: '0.4rem 0.8rem',
      fontSize: '0.85rem',
    },
    '(max-width: 710px)': {
      padding: '0.3rem 0.6rem',
      fontSize: '0.8rem',
    },
    '(max-width: 480px)': {
      padding: '0.3rem 0.5rem',
      fontSize: '0.75rem',
    },
  },
});

// -----------------------------
// Liste des établissements
// -----------------------------
export const companyList = style({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const companyItem = style({
  padding: '0.5rem 1rem',
  backgroundColor: '#f0f0f0',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '@media': {
    '(max-width: 710px)': {
      padding: '0.4rem 0.8rem',
    },
    '(max-width: 480px)': {
      padding: '0.35rem 0.6rem',
    },
  },
});

// -----------------------------
// Texte d'information
// -----------------------------
export const info = style({
  margin: '0.5rem 0',
  fontSize: '1rem',
  color: '#333',
  lineHeight: '1.6',
  textAlign: 'center',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '0.95rem',
    },
    '(max-width: 710px)': {
      fontSize: '0.9rem',
    },
    '(max-width: 480px)': {
      fontSize: '0.7rem',
    },
  },
});
