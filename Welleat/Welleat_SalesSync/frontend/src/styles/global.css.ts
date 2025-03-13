// src/styles/global.css.ts

import { style, globalStyle, createVar } from '@vanilla-extract/css';
import { vars } from './variables.css';

globalStyle(':root', {
  vars: {
    '--primary': '#13674E',
    '--secondary': '#218838',
    '--overlay': 'rgba(0, 0, 0, 0.7)',
    '--textPrimary': '#ffffff',
    '--textSecondary': '#333333',
    '--danger': '#f44336',
    '--warning': '#FFC107',
    '--disabled': '#cccccc',
    '--asigne': '#879FEEFF',
  },
});

globalStyle('body', {
  margin: 0,
  padding: 0,
  fontFamily: 'Arial, sans-serif',
});
