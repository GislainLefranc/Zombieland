// src/Pages/About/AboutPage.css.ts
import { style } from '@vanilla-extract/css';

export const aboutContent = style({
  width: '100%',
  maxWidth: '900px',
  padding: '0 5rem',
  textAlign: 'left',
  color: 'white',
  '@media': {
    'screen and (max-width: 1000px)': {
      padding: '1.5rem',
    },
  },
});

export const aboutTitle = style({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
  textAlign: 'center',
  '@media': {
    'screen and (max-width: 1000px)': {
      fontSize: '2rem',
    },
  },
});

export const companyInfo = style({
  backgroundColor: '#EEEEEEFF',
  padding: '2rem',
  borderRadius: '1rem',
  marginBottom: '2rem',
});

export const companyInfoParagraph = style({
  margin: '0.5rem 0',
  color: '#333',
  '@media': {
    'screen and (max-width: 1000px)': {
      fontSize: '0.9rem',
    },
  },
});

export const companyInfoStrong = style({
  fontWeight: 'bold',
  color: '#000',
});

export const legalInfoTitle = style({
  marginBottom: '1rem',
  fontSize: '1.5rem',
  textAlign: 'center',
});

export const legalInfoLink = style({
  color: 'white',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  ':hover': {
    color: '#FFD700',
  },
  '@media': {
    'screen and (max-width: 1000px)': {
      fontSize: '0.9rem',
    },
  },
});
