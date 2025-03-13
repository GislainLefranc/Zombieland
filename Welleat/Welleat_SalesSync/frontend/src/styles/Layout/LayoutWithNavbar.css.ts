
import { style } from '@vanilla-extract/css';

export const content = style({
  paddingTop: '0rem',
  '@media': {
    'screen and (max-width: 1000px)': {
      paddingTop: '0rem',
    },
    'screen and (max-width: 480px)': {
      paddingTop: '0rem',
    },
  },
});