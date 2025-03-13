import { style } from '@vanilla-extract/css';

// Déclarer supportLink en premier
export const supportLink = style({
  backgroundColor: 'transparent',
  color: 'black',
  textDecoration: 'none',
  fontWeight: 'bold',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  transition: 'all 0.3s ease',
});

export const supportContainer = style({
  margin: 'auto',
  width: '100%',
  textAlign: 'right',
  padding: '1rem 2rem',
  backgroundColor: 'transparent',
  boxSizing: 'border-box',

  '@media': {
    '(min-width: 1000px)': {
      position: 'static',
      textAlign: 'right',
      width: '100%',
      padding: '1rem 2rem',
    },
  },
});

export const supportText = style({
  display: 'inline',
  fontSize: '1rem',
  color: 'black',

  '@media': {
    '(max-width: 1000px)': {
      display: 'none',
    },
  },

  selectors: {
    [`${supportLink}:hover &`]: {
      textDecoration: 'underline',
    },
  },
});

export const supportIcon = style({
  display: 'none',
  backgroundColor: '#FFCF01',
  color: 'black',
  fontWeight: 'bold',
  borderRadius: '50%',
  width: '35px',
  height: '35px',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '-15px',
  fontSize: '1.2rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',

  '@media': {
    '(max-width: 1000px)': {
      display: 'flex',
    },
    '(max-width: 480px)': {
      width: '30px',
      height: '30px',
      fontSize: '1rem',
    },
  },

  selectors: {
    [`${supportLink}:hover &`]: {
      backgroundColor: '#e0bc04',
    },
  },
});
