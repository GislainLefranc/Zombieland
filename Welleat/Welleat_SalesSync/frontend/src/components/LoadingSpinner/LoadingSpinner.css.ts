import { style, keyframes } from '@vanilla-extract/css';

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const spinnerOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
});

export const spinnerContainer = style({
  display: 'inline-block',
  position: 'relative',
  width: '64px',
  height: '64px',
});

export const spinner = style({
  boxSizing: 'border-box',
  display: 'block',
  position: 'absolute',
  width: '51px',
  height: '51px',
  margin: '6px',
  border: '6px solid #3498db',
  borderRadius: '50%',
  animation: `${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
  borderColor: '#3498db transparent transparent transparent',
});
