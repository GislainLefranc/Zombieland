// src/pages/DashboardPage/DashboardPage.css.ts

import { style } from '@vanilla-extract/css';

export const dashboardContainer = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  boxSizing: 'border-box',
  minHeight: '100vh',
  backgroundColor: '#f9f9f9',
});

export const pendingMessage = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#ffcf01',
  color: 'black',
  padding: '1rem',
  borderRadius: '5px',
  marginBottom: '1rem',
  marginTop: '1rem',
});

export const tableContainer = style({
  flex: 1,
  overflowX: 'auto',
  overflowY: 'auto',
  marginBottom: '1rem',
});

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999,
});

export const modal = style({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  maxWidth: '90%',
  maxHeight: '90%',
  overflowY: 'auto',
});

export const modalCloseBtn = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#333',
});

export const error = style({
  color: 'red',
  marginTop: '1rem',
});

export const sectionTitle = style({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
});

export const sectionHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem',
});

export const columnContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: '0.5rem',
});

export const listItem = style({
  padding: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  backgroundColor: '#fdfdfd',
});

export const selectedInterlocutorsContainer = style({
  color: '#333',
});
