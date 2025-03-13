import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/variables.css';
import { addButton } from '../../styles/Buttons/Buttons.css';

export const tableContainer = style({
  width: '100%',
  overflowX: 'auto',
  marginTop: vars.spacing.large,
  padding: vars.spacing.medium,
  backgroundColor: vars.colors.backgroundSecondary,
  borderRadius: vars.borderRadius.medium,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
    }
  }
});

export const tableCell = style({
  border: `1px solid ${vars.colors.border}`,
  padding: '0.75rem',
  textAlign: 'center',
  fontSize: vars.fontSize.small,
  color: vars.colors.textSecondary,
  selectors: {
    '&:last-child': {
      minWidth: '100px'
    }
  }
});

export { addButton };