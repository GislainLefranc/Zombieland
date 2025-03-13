// src/components/GreenBackground/GreenBackground.css.ts

import { style } from '@vanilla-extract/css';

export const pageContainer = style({
  width: '100%', 
  maxWidth: '1200px', 
  margin: '0 auto', 
  padding: '1rem', 
  paddingTop: '180px', 
  boxSizing: 'border-box',
  '@media': {
    '(max-width: 1270px)': {
      maxWidth: '1000px',
      padding: '0.8rem 1rem',
      marginTop: '2rem', 
    },
    '(max-width: 710px)': {
      maxWidth: '100%',
      padding: '0.5rem',
      paddingTop: '15px', 
    },
  },
});

// Style du rectangle
export const rectangle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#13674E',
  borderRadius: '2rem',
  padding: '2rem', 
  maxWidth: '95vw', 
  width: '100%', 
  height: 'auto',
  boxSizing: 'border-box',
  margin: '0 auto',
  overflow: 'auto', 
  '@media': {
    '(max-width: 1270px)': {
      padding: '1.5rem',
    },
    '(max-width: 710px)': {
      padding: '1rem',
      borderRadius: '1rem',
    },
  },
});