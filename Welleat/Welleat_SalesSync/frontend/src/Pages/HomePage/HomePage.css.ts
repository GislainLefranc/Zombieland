// src/Pages/HomePage/HomePage.css.ts

import { style } from '@vanilla-extract/css';

export const homeContent = style({
  width: '100%',
  maxWidth: '900px',
  textAlign: 'center',
  color: '#ffffff',
  boxSizing: 'border-box',
  margin: '0 auto',
  padding: '2rem',
  '@media': {
    '(max-width: 1270px)': {
      padding: '1.5rem',
    },
    '(max-width: 710px)': {
      padding: '1rem',
    },
  },
});

export const homeTitle = style({
  fontWeight: 'bold',
  color: '#FFFFFF',
  fontSize: '2rem',
  marginBottom: '0.5rem',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1.8rem',
    },
    '(max-width: 710px)': {
      fontSize: '1.5rem',
    },
  },
});

export const homeSubtitle = style({
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#FFCF01',
  marginTop: '0.2rem',
  '@media': {
    '(max-width: 1270px)': {
      fontSize: '1rem',
    },
    '(max-width: 710px)': {
      fontSize: '0.9rem',
    },
  },
});

export const homeImage = style({
  width: '100%',
  maxWidth: '400px',
  height: 'auto',
  margin: '0.5rem auto 2rem',
  '@media': {
    '(max-width: 1270px)': {
      maxWidth: '350px',
      margin: '1rem auto 2rem',
    },
    '(max-width: 710px)': {
      maxWidth: '100%', 
      margin: '1rem auto 1.5rem',
    },
  },
});

export const buttonContainer = style({
  marginTop: '2rem',
  display: 'flex',
  justifyContent: 'center',
  '@media': {
    '(max-width: 1270px)': {
      marginTop: '1.5rem',
    },
    '(max-width: 710px)': {
      marginTop: '1rem',
    },
  },
});
