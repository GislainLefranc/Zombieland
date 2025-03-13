import { style, createVar } from '@vanilla-extract/css';
import { vars } from '../variables.css';

// Variables CSS pour les couleurs
export const buttonColor = createVar();
export const hoverColor = createVar();

// Style de base pour tous les boutons
export const baseButton = style({
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, font-size 0.3s ease, padding 0.3s ease',
  vars: {
    [buttonColor]: '#FFCF01',
    [hoverColor]: '#e0bc04', 
  },
  backgroundColor: buttonColor,
  color: '#000000',
  width: 'auto',
  fontFamily: 'inherit',
  outline: 'none',

  ':hover': {
    backgroundColor: hoverColor,
  },

  ':disabled': {
    backgroundColor: vars.colors.disabled,
    cursor: 'not-allowed',
  },

  // Exemple de base pour petite responsivité
  '@media': {
    'screen and (max-width: 600px)': {
      width: '150px',
    },
  },
});

// Variantes des boutons (couleurs spécifiques)

export const primaryButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.primary,
      [hoverColor]: vars.colors.primaryHover,
    },
  },
]);

export const secondaryButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.modalCancel,
      [hoverColor]: vars.colors.modalCancelHover,
    },
    color: vars.colors.textPrimary,
  },
]);

export const dangerButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.danger,
      [hoverColor]: vars.colors.dangerHover,
    },
    color: '#ffffff',
  },
]);

export const submitButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.submit,
      [hoverColor]: vars.colors.submitHover,
    },
    color: '#ffffff',
  },
]);

export const addButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.add,
      [hoverColor]: vars.colors.addHover,
    },
    color: '#000000',
    fontWeight: 'bold',
    '@media': {
      'screen and (max-width: 768px)': {
        width: '100%',
      },
    },
  },
]);

export const assignButton = style({
  backgroundColor: vars.colors.assign,
  color: vars.colors.textPrimary,
  padding: vars.spacing.medium,
  borderRadius: vars.borderRadius.small,
  border: 'none',
  cursor: 'pointer',
  fontSize: vars.fontSize.medium,
  fontWeight: 'bold',
  width: '100%',
  transition: 'background-color 0.3s ease',
  ':hover': {
    backgroundColor: vars.colors.assignHover,
  },
  ':disabled': {
    backgroundColor: vars.colors.disabled,
    cursor: 'not-allowed',
  },
});

// Boutons modaux
export const modalSendBtn = style([
  baseButton,
  {
    fontWeight: 'bold',
    vars: {
      [buttonColor]: vars.colors.modalSend,     
      [hoverColor]: vars.colors.modalSendHover,
    },
    color: '#ffffff',
  },
]);

export const modalCancelBtn = style([
  baseButton,
  {
    fontWeight: 'bold',
    marginLeft: '1rem',
    vars: {
      [buttonColor]: vars.colors.modalCancel,     
      [hoverColor]: vars.colors.modalCancelHover,
    },
    color: '#181818FF',
  },
]);

export const modalDangerBtn = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.modalDanger,
      [hoverColor]: vars.colors.modalDangerHover,
    },
  },
]);

export const independentGreenButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.independentGreen,
      [hoverColor]: vars.colors.independentGreenHover,
    },
  },
]);

export const calculateButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.calculate,
      [hoverColor]: vars.colors.calculateHover,
    },
  },
]);

export const simulationButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.simulationButton,
      [hoverColor]: vars.colors.simulationButtonHover,
    },
  },
]);

export const loginButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.login,
      [hoverColor]: vars.colors.loginHover,
    },
    color: vars.colors.textPrimary,
  },
]);

export const cancelButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.modalCancel,
      [hoverColor]: vars.colors.modalCancelHover,
    },
    color: vars.colors.textPrimary,
  },
]);

export const assignDashboardButton = style([
  baseButton,
  {
    vars: {
      [buttonColor]: vars.colors.assign,
      [hoverColor]: vars.colors.assignHover,
    },
    color: '#ffffff',
  },
]);

export const actionButton = style({
  padding: '5px',
  margin: '0 5px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '4px',
  },
});

// Tailles des boutons (petite, moyenne, grande) + responsive

export const smallButton = style({
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  '@media': {
    '(max-width: 768px)': {
      fontSize: '0.8rem',
      width: '80%',
    },
    '(max-width: 480px)': {
      fontSize: '0.8rem',
      width: '100%',
      padding: '0.7rem',
    },
  },
});

export const mediumButton = style({
  '@media': {
    '(max-width: 768px)': {
      fontSize: '0.9rem',
    },
    '(max-width: 480px)': {
      fontSize: '0.8rem',
      width: '100%',
      padding: '0.7rem',
    },
  },
});

export const largeButton = style({
  padding: '1.5rem 1rem',
  fontSize: '1.6rem',
  '@media': {
    '(max-width: 768px)': {
      fontSize: '1.4rem',
      padding: '1rem',
    },
    '(max-width: 480px)': {
      fontSize: '1.2rem',
      width: '100%',
      padding: '1rem',
    },
  },
});

export const responsiveButton = style({
  '@media': {
    '(max-width: 768px)': {
      width: '50%',
      fontSize: '1.2rem',
      padding: '0.8rem 1.5rem',
      margin: '0.5rem',
    },
    '(max-width: 480px)': {
      fontSize: '1rem',
      width: '90%',
      padding: '0.5rem 0.2rem',
      marginBottom: '0.75rem',
    },
  },
});

export const errorDetails = style({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '1rem',
  margin: '1rem 0',
  borderRadius: '8px',
  maxWidth: '100%',
  overflowX: 'auto',
  color: '#dc3545',
  fontSize: '0.875rem',
  fontFamily: 'monospace',
});

export const errorActions = style({
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '@media': {
    '(max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
});