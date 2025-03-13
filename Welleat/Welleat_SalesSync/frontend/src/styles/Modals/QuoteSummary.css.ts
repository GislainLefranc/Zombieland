// [Dossier: styles/Modals] | Fichier: QuoteSummary.css.ts

import { style } from '@vanilla-extract/css';
import { vars } from './../variables.css';

export const modalSection = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

export const summarySection = style({
  width: '100%',
  maxWidth: '800px',
  backgroundColor: '#fff',
  padding: '10px',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

export const sectionTitle = style({
  backgroundColor: '#13674E',  
  color: '#ffffff',          
  fontSize: '1.5rem',
  fontWeight: 600,
  padding: '12px 16px',
  borderRadius: '4px',
  marginBottom: '16px',
  textAlign: 'center',
});

export const customSubSectionTitle = style({
  fontSize: '1rem',        
  color: '#000000',         
  fontWeight: 'normal',     
  fontStyle: 'normal',      
  marginBottom: '0.5rem',
 
  borderBottom: '1px solid #ccc',
  paddingBottom: '0.3rem',
});



export const summaryItem = style({
  marginBottom: '16px',
});

export const summaryTotal = style({
  fontWeight: 700,
  fontSize: '1rem',
  marginTop: '8px',
  textAlign: 'right',
  color: '#333',
});

export const smallText = style({
  fontSize: '0.8rem',
  color: '#777',
});

export const calculationDetail = style({
  marginLeft: '16px',
  fontSize: '0.9rem',
  color: '#555',
});

export const summaryDivider = style({
  height: '1px',             
  backgroundColor: '#ccc',  
  margin: '16px 0',
});

// Style pour la section "Tarif Total Suivant Engagement" pour la mettre en valeur
export const highlightedTariff = style({
  backgroundColor: '#f7f7f7',
  borderLeft: '4px solid #13674E',
  padding: '16px',
  borderRadius: '4px',
  marginTop: '20px',
});

export const responsive = style({
  '@media': {
    'screen and (max-width: 768px)': {
      padding: '8px',
      fontSize: '0.9rem',
      marginBottom: '12px',
    },
  },
});

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

