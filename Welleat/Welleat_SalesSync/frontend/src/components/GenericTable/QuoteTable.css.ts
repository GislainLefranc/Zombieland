// src/components/QuoteTable/QuoteTable.css.ts

import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/variables.css';

export const tableContainer = style({
  width: '100%',
  overflowX: 'auto', // Permet le défilement horizontal si nécessaire
  marginTop: vars.spacing.large,
  padding: vars.spacing.medium,
  backgroundColor: '#ffffff',
  borderRadius: vars.borderRadius.medium,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '@media': {
    'screen and (max-width: 768px)': {
      padding: vars.spacing.medium,
    },
    'screen and (max-width: 480px)': {
      padding: vars.spacing.small,
    },
  },
});

export const quoteTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '600px', // Définir une largeur minimale appropriée
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: vars.fontSize.small,
    },
    'screen and (max-width: 480px)': {
      fontSize: '0.875rem',
      minWidth: '480px', // Ajuster la largeur minimale
    },
  },
});

export const quoteTableHead = style({
  backgroundColor: vars.colors.primary,
  color: vars.colors.textPrimary,
  fontWeight: 'bold',
});

export const quoteTableHeader = style({
  padding: '1rem',
  textAlign: 'left',
  fontSize: vars.fontSize.medium,
  '@media': {
    'screen and (max-width: 768px)': {
      padding: '0.75rem',
      fontSize: vars.fontSize.small,
    },
    'screen and (max-width: 480px)': {
      padding: '0.5rem',
      fontSize: '0.75rem',
    },
  },
});

export const quoteTableBody = style({
  color: vars.colors.textSecondary,
});

export const quoteTableRow = style({
  selectors: {
    '&:nth-child(even)': {
      backgroundColor: '#f2f2f2',
    },
    '&:hover': {
      backgroundColor: vars.colors.hover,
    }
  }
});

export const quoteTableCell = style({
  padding: '0.75rem 1rem',
  borderBottom: `1px solid ${vars.colors.border}`,
  fontSize: vars.fontSize.small,
  '@media': {
    'screen and (max-width: 768px)': {
      padding: '0.5rem 0.75rem',
      fontSize: vars.fontSize.small,
    },
    'screen and (max-width: 480px)': {
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
    },
  },
});

export const iconButton = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.5rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.colors.textPrimary,
  
  ':hover': {
    color: vars.colors.primaryHover,
  },
  
  ':disabled': {
    color: vars.colors.disabled,
    cursor: 'not-allowed',
  },
});

export const actionButton = style({
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  color: vars.colors.textPrimary,
  fontSize: '1.1rem',
  transition: 'all 0.2s ease',
  borderRadius: '50%',
  width: '35px',
  height: '35px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 4px',

  ':hover': {
    backgroundColor: vars.colors.hover,
    color: vars.colors.primary,
    transform: 'scale(1.1)',
  },

  selectors: {
    '&[aria-label="Modifier"]:hover': {
      color: vars.colors.primary,
    },
    '&[aria-label="Supprimer"]:hover': {
      color: vars.colors.danger,
    }
  }
});

export const addButton = style({
  backgroundColor: vars.colors.primary,
  color: vars.colors.textPrimary,
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: vars.borderRadius.medium,
  cursor: 'pointer',
  fontSize: vars.fontSize.medium,
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',

  ':hover': {
    backgroundColor: vars.colors.primaryHover,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
  },

  ':active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }
});

export const loading = style({
  textAlign: 'center',
  padding: '2rem',
  fontSize: vars.fontSize.medium,
  color: vars.colors.textSecondary,
});

export const noResults = style({
  textAlign: 'center',
  padding: '2rem',
  fontSize: vars.fontSize.medium,
  color: vars.colors.textSecondary,
});

export const hideOnMobile = style({
  '@media': {
    'screen and (max-width: 480px)': {
      display: 'none',
    },
  },
});
