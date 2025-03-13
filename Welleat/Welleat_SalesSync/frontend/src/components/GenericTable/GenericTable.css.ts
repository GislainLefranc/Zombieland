
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/variables.css';

export const tableContainer = style({
  width: '100%',
  overflowX: 'auto',
  marginTop: vars.spacing.large,
  padding: vars.spacing.medium,
  backgroundColor: vars.colors.backgroundSecondary,
  borderRadius: vars.borderRadius.medium,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '600px',
});

export const tableHeader = style({
  backgroundColor: vars.colors.primary,
  color: vars.colors.textPrimary,
  fontWeight: 'bold',
  padding: '1rem',
  textAlign: 'center',
  fontSize: vars.fontSize.medium,
});

export const tableRow = style({
  selectors: {
    '&:nth-child(even)': {
      backgroundColor: '#f2f2f2',
    },
    '&:hover': {
      backgroundColor: vars.colors.hover,
    },
  },
});

export const tableCell = style({
  border: `1px solid ${vars.colors.border}`,
  padding: '0.75rem',
  textAlign: 'center',
  fontSize: vars.fontSize.small,
  color: vars.colors.textSecondary,
  selectors: {
    '&:last-child': {
      minWidth: '100px',
    },
  },
});

export const equipementTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '600px',

  '@media': {
    'screen and (max-width: 768px)': {
      minWidth: '500px',
    },
    'screen and (max-width: 480px)': {
      minWidth: '100%',
    },
  },
});

export const actionButtons = style({
  display: 'flex',
  gap: '0.25rem', 
  justifyContent: 'center',
});

export const actionButton = style({
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  color: vars.colors.textPrimary,
  fontSize: '1.1rem',
  transition: 'all 0.2s ease',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

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
    },
    '&[aria-label="Modifier la formule"]:hover': {
      color: vars.colors.primary,
    },
    '&[aria-label="Supprimer la formule"]:hover': {
      color: vars.colors.danger,
    },
    '&[aria-label="Éditer l\'équipement"]:hover': {
      color: vars.colors.primary,
    },
    '&[aria-label="Supprimer l\'équipement"]:hover': {
      color: vars.colors.danger,
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

