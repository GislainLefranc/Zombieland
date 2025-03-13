
import { style } from '@vanilla-extract/css';

export const companyForm = style({
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: '#13674E',
  borderRadius: '10px',
  boxSizing: 'border-box',
  color: '#ffffff',
  '@media': {
    '(max-width: 767px)': {
      padding: '1rem',
      borderRadius: '5px',
    },
  },
});

export const formTitle = style({
  textAlign: 'center',
  marginBottom: '2rem',
  fontSize: '2rem',
  '@media': {
    '(max-width: 1199px)': {
      fontSize: '1.8rem',
    },
    '(max-width: 767px)': {
      fontSize: '1.5rem',
      marginBottom: '1.5rem',
    },
  },
});

export const formColumns = style({
  display: 'flex',
  gap: '2rem',
  flexWrap: 'wrap',
  '@media': {
    '(max-width: 1199px)': {
      gap: '1.5rem',
    },
    '(max-width: 767px)': {
      flexDirection: 'column',
      gap: '1rem',
    },
  },
});

export const formColumn = style({
  flex: '1',
  minWidth: '300px',
  '@media': {
    '(max-width: 767px)': {
      minWidth: '100%',
    },
  },
});

export const inputGroup = style({
  marginBottom: '1rem',
  '@media': {
    '(max-width: 767px)': {
      marginBottom: '0.75rem',
    },
  },
});

export const inputLabel = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  color: '#ffffff',
  fontSize: '1.2rem',
  '@media': {
    '(max-width: 1199px)': {
      fontSize: '1.1rem',
    },
    '(max-width: 767px)': {
      fontSize: '1rem',
    },
  },
});

export const formInput = style({
  width: '100%',
  padding: '0.5rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
  color: '#000000',
  '@media': {
    '(max-width: 767px)': {
      padding: '0.4rem',
      fontSize: '0.9rem',
    },
  },
});

export const buttonsContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '2rem',
  flexWrap: 'wrap',
  gap: '1rem',
  '@media': {
    '(max-width: 1199px)': {
      marginTop: '1.5rem',
    },
    '(max-width: 767px)': {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
    },
  },
});

export const formSectionTitle = style({
  marginTop: '2rem',
  marginBottom: '1rem',
  fontSize: '1.5rem',
  '@media': {
    '(max-width: 1199px)': {
      fontSize: '1.3rem',
      marginTop: '1.5rem',
      marginBottom: '0.8rem',
    },
    '(max-width: 767px)': {
      fontSize: '1.2rem',
      marginTop: '1rem',
      marginBottom: '0.6rem',
    },
  },
});

export const interlocutorItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '5px',
  marginBottom: '1rem',
  backgroundColor: '#ffffff',
  color: '#000000',
  '@media': {
    '(max-width: 767px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0.6rem',
    },
  },
});

export const editModeInterlocutorItem = style({
  backgroundColor: '#e0e0e0',
  color: '#706C6CFF',
});

export const interlocutorActions = style({
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
  
  '@media': {
    '(max-width: 767px)': {
      flexDirection: 'column',
      width: '100%',
      gap: '0.5rem',
    },
  },
});

export const radioGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginLeft: '12rem',
  '@media': {
    '(max-width: 1199px)': {
      marginLeft: '60%',
    },
    '(max-width: 767px)': {
      marginLeft: '50%',
    },
  },
});

export const radioLabel = style({
  display: 'grid',
  gridTemplateColumns: '24px 1fr', 
  alignItems: 'center',
  gap: '0.5rem',
  width: '100%',
  maxWidth: '400px',
});

export const inlineGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  '@media': {
    '(max-width: 767px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.5rem',
      marginBottom: '0.75rem',
    },
  },
});

export const inlineInput = style({
  width: '50px',
  marginRight: '8rem',
  '@media': {
    '(max-width: 1199px)': {
      marginRight: '4rem',
    },
    '(max-width: 767px)': {
      marginRight: '0',
      width: '100%',
    },
  },
});

export const hidden = style({
  display: 'none',
});

export const simulationPendingContent = style({
  backgroundColor: '#ffeb3b',
  padding: '1rem',
  borderRadius: '4px',
  marginBottom: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const simulationPendingMessage = style({
  padding: '1rem',
  backgroundColor: '#ffeb3b',
  borderRadius: '5px',
  marginBottom: '1rem',
  textAlign: 'center',
  color: '#000',
  fontWeight: 'bold',
  '@media': {
    '(max-width: 767px)': {
      padding: '0rem',
      fontSize: '0.9rem',
    },
  },
});

export const textarea = style({
  width: '100%',
  padding: '0.5rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
  color: '#000000',
  resize: 'vertical',
  '@media': {
    '(max-width: 767px)': {
      padding: '0.4rem',
      fontSize: '0.9rem',
    },
  },
});
  