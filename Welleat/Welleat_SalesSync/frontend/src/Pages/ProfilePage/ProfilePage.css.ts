// src/Pages/ProfilePage/ProfilePage.css.ts
import { style, globalStyle } from '@vanilla-extract/css';

export const profileContent = style({
  maxWidth: '900px',
  textAlign: 'left',
  color: '#ffffff',
});

export const profileTitle = style({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
  textAlign: 'center',
});

export const profileSubtitle = style({
  fontSize: '1.1rem',
  marginBottom: '2rem',
  fontWeight: 'bold',
  color: '#e0bc04',
  textAlign: 'center',
});

export const profileFields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

export const actions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: '2rem',
});

export const leftAction = style({
  marginRight: 'auto',
});

export const rightAction = style({
  marginLeft: 'auto',
});

const mediaQuery = '@media (max-width: 1271px)';
const smallMediaQuery = '@media (max-width: 480px)';

globalStyle(mediaQuery, {
  [`.${profileContent}`]: {
    padding: '2rem',
  },
  [`.${profileTitle}`]: {
    fontSize: '2rem',
  },
  [`.${profileSubtitle}`]: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
  },
  [`.${actions}`]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  [`.${leftAction}, .${rightAction}`]: {
    margin: '0 0 1rem 0',
  },
});

globalStyle(smallMediaQuery, {
  [`.${profileTitle}`]: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
  },
  [`.${profileFields}`]: {
    gap: '1rem',
  },
});
