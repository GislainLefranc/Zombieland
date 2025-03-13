import { style } from '@vanilla-extract/css';
import { vars } from '../../../../../styles/variables.css';

export const filterBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing.medium,
  padding: vars.spacing.medium,
  backgroundColor: vars.colors.backgroundLight,
  borderRadius: vars.borderRadius.small,
  boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
});

export const searchInput = style({
  padding: vars.spacing.small,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.borderRadius.small,
  flex: 1,
});

export const selectInput = style({
  padding: vars.spacing.small,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.borderRadius.small,
  backgroundColor: 'white',
});
