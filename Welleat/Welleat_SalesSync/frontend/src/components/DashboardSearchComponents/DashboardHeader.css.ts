
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/variables.css';

export const dashboardHeader = style({
  marginTop: '10rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#13674e', 
  padding: '1rem 2rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  color: '#ffffff',
  '@media': {
    'screen and (max-width: 1271px)': {
      marginTop: '3rem',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '1rem',
    },
    'screen and (max-width: 480px)': {
      padding: '0.75rem',
    },
  },
});

export const headerLeft = style({
  display: 'flex',
  alignItems: 'center',
});

export const dashboardHeaderTitle = style({
  fontSize: vars.fontSize.xlarge,
  fontWeight: 'bold',
  margin: 0,
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: vars.fontSize.large,
    },
    'screen and (max-width: 480px)': {
      fontSize: vars.fontSize.medium,
    },
  },
});

export const headerRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  '@media': {
    'screen and (max-width: 768px)': {
      marginTop: '1rem',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    'screen and (max-width: 480px)': {
      gap: '0.5rem',
    },
  },
});

export const searchInput = style({
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: vars.fontSize.medium,
  width: '250px',
  '@media': {
    'screen and (max-width: 768px)': {
      width: '95%',
    },
    'screen and (max-width: 480px)': {
      fontSize: '0.875rem',
      padding: '0.5rem',
    },
  },
});

export const resultsCount = style({
  fontSize: vars.fontSize.medium,
  color: '#d1ffd6', 
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: vars.fontSize.small,
    },
    'screen and (max-width: 480px)': {
      fontSize: '0.75rem',
    },
  },
});
