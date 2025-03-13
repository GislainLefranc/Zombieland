// LoginPage.css.ts
import { style } from '@vanilla-extract/css';

export const loginContent = style({
  width: '100%',
  maxWidth: '600px',
  margin: '10rem auto',
  padding: '3rem',
  textAlign: 'center',
  color: 'white',
  boxSizing: 'border-box',
  backgroundColor: '#13674E',
  borderRadius: '1rem',
  '@media': {
    '(max-width: 1000px)': {
      maxWidth: '90%',
      margin: '12rem auto',
      padding: '2rem',
    },
  },
});

export const loginTitle = style({
  '@media': {
    '(max-width: 1000px)': {
      fontSize: '2rem',
    },
  },
});

export const inputGroup = style({
  width: '100%',
  marginBottom: '1.5rem',
});

export const loginInput = style({
  width: '100%',
  padding: '1rem',
  borderRadius: '1rem',
  border: '1px solid #ccc',
  fontSize: '1rem',
  backgroundColor: 'white',
  color: 'black',
  boxSizing: 'border-box',
});

export const loginButton = style({
  marginTop: '1rem',
});

export const errorMessage = style({
  color: '#ff0000',
  fontSize: '0.9rem',
  marginTop: '1rem',
});
