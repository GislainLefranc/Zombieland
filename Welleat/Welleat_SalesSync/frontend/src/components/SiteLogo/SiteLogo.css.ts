import { style } from '@vanilla-extract/css';

export const siteLogoContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 20px',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1300,
  backgroundColor: '#ffffff',
  height: '100px',

  '@media': {
    '(max-width: 1271px)': {
      justifyContent: 'flex-end',
      left: '0',
      right: '0',
      transform: 'none',
      padding: '10px',
      height: 'auto',
      width: 'auto',
      backgroundColor: 'transparent',
    },
  },
});

// Styles pour le conteneur non responsive
export const siteLogoContainerFixed = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 20px',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1300,
  backgroundColor: '#ffffff',
  height: '100px',
});

// Styles pour le logo responsive
export const siteLogo = style({
  width: '7rem',
  height: 'auto',
  marginRight: '10px',
  transition: 'all 0.3s ease',

  '@media': {
    '(max-width: 1271px)': {
      width: '50px',
      height: '60px',
      marginRight: '0px',
    },
  },
});

// Styles pour le logo non responsive
export const siteLogoFixed = style({
  width: '7rem',
  height: 'auto',
  marginRight: '10px',
  transition: 'all 0.3s ease',
});

// Styles pour le titre responsive
export const siteTitle = style({
  fontSize: '2rem',
  fontWeight: 900,
  color: '#059A6D',

  '@media': {
    '(max-width: 1271px)': {
      display: 'none',
    },
  },
});

// Styles pour le titre non responsive
export const siteTitleFixed = style({
  fontSize: '2rem',
  fontWeight: 900,
  color: '#059A6D',
});

export const logoCircle = style({
  position: 'absolute',
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: '#ffffff',
  zIndex: -1,

  '@media': {
    '(max-width: 1271px)': {
      width: '40px',
      height: '40px',
    },
  },
});

// Modifier le conteneur du logo pour gérer le positionnement relatif
export const logoWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '-15px',
});

export const logoLink = style({
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
});