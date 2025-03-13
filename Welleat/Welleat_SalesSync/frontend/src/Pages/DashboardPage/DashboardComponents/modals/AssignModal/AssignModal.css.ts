// Dossier : src/components/DashboardComponents/modals/AssignModal
// Fichier : AssignModal.css.ts
// Ce fichier gère les styles (Vanilla Extract) pour le composant AssignModal
// avec un design à thème vert amélioré et une meilleure expérience utilisateur

import { style } from '@vanilla-extract/css';
import { vars } from '../../../../../styles/variables.css';

/* ----------------------------------------------------------------------------
   Objets utilitaires
   ----------------------------------------------------------------------------*/
const flexCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};


/* ----------------------------------------------------------------------------
   Superposition de la modale
   ----------------------------------------------------------------------------*/
export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: vars.colors.overlay,
  zIndex: 3000,
  ...flexCenter,
});

/* ----------------------------------------------------------------------------
   Contenu de la modale
   ----------------------------------------------------------------------------*/
export const modalContent = style({
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '900px',
  maxHeight: '90%',
  overflowY: 'auto',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  padding: '1rem',

  '@media': {
    'screen and (max-width: 768px)': {
      width: '95%',
      maxWidth: '95%',
      padding: '0.8rem',
    },
    'screen and (max-width: 480px)': {
      width: '100%',
      maxWidth: '100%',
      padding: '0.5rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   En-tête de la modale avec bandeau vert et logo
   ----------------------------------------------------------------------------*/
   export const modalHeader = style({
    backgroundColor: '#13674e',
    color: '#ffffff',       
    marginBottom: '1rem',
    borderRadius: '6px',
    padding: '1rem',
    textAlign: 'center',
    ...flexCenter,
    flexDirection: 'column',
  
    '@media': {
      'screen and (max-width: 768px)': {
        padding: '0.8rem',
      },
      'screen and (max-width: 480px)': {
        padding: '0.5rem',
      },
    },
  });

/* ----------------------------------------------------------------------------
   Style du logo
   ----------------------------------------------------------------------------*/
   export const modalLogo = style({
    maxHeight: '60px', 
    marginBottom: '0.5rem',
  });

/* ----------------------------------------------------------------------------
   Bouton de fermeture de la modale
   ----------------------------------------------------------------------------*/
export const modalCloseBtn = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'none',
  border: 'none',
  color: '#ffffff', 
  cursor: 'pointer',
  fontSize: '1.5rem',
  transition: 'color 0.3s ease',

  ':hover': {
    color: vars.colors.modalCancelHover, 
  },

  '@media': {
    'screen and (max-width: 768px)': {
      top: '0.8rem',
      right: '0.8rem',
      fontSize: '1.2rem',
    },
    'screen and (max-width: 480px)': {
      top: '0.6rem',
      right: '0.6rem',
      fontSize: '1rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   Titre de la modale
   ----------------------------------------------------------------------------*/
   export const modalTitle = style({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#ffffff',
    textAlign: 'center',
  
    '@media': {
      'screen and (max-width: 768px)': {
        fontSize: '1.2rem',
      },
      'screen and (max-width: 480px)': {
        fontSize: '1rem',
      },
    },
  });

/* ----------------------------------------------------------------------------
   Section principale de la modale
   ----------------------------------------------------------------------------*/
export const modalMain = style({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '1rem',

  '@media': {
    'screen and (max-width: 768px)': {
      gap: '0.8rem',
    },
    'screen and (max-width: 480px)': {
      gap: '0.5rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   Conteneur de section avec bandeau vert
   ----------------------------------------------------------------------------*/
export const section = style({
  backgroundColor: '#f9f9f9',
  borderRadius: '6px',
  padding: '1rem',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginBottom: '1rem',
});

/* ----------------------------------------------------------------------------
   Bandeau vert pour les titres de section : Établissements, Interlocuteurs, Membres Welleat
   ----------------------------------------------------------------------------*/
export const sectionHeader = style({
  backgroundColor: '#13674e', 
  color: '#ffffff', 
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  ...flexCenter,
  justifyContent: 'flex-start',

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '0.4rem 0.8rem',
      fontSize: '1rem',
    },
    'screen and (max-width: 480px)': {
      padding: '0.3rem 0.6rem',
      fontSize: '0.9rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   Titre de la section
   ----------------------------------------------------------------------------*/
export const sectionTitle = style({
  margin: 0,
  padding: 0,
  color: '#ffffff', 
});

/* ----------------------------------------------------------------------------
   Élément de liste
   ----------------------------------------------------------------------------*/
export const listItem = style({
  padding: '0.5rem',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  marginBottom: '0.25rem',
  border: `1px solid ${vars.colors.border}`,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: vars.colors.hover,
  },
  width: '100%',
});

/* ----------------------------------------------------------------------------
   Contenu de colonne
   ----------------------------------------------------------------------------*/
export const columnContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

/* ----------------------------------------------------------------------------
   Conteneur de colonnes
   ----------------------------------------------------------------------------*/
export const columnsContainer = style({
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
  flexWrap: 'wrap',

  '@media': {
    'screen and (max-width: 768px)': {
      flexDirection: 'column',
      gap: '0.8rem',
    },
    'screen and (max-width: 480px)': {
      flexDirection: 'column',
      gap: '0.5rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   Colonne individuelle
   ----------------------------------------------------------------------------*/
export const column = style({
  flex: '1 1 250px',
  backgroundColor: '#ffffff',
  border: `1px solid ${vars.colors.border}`,
  borderRadius: '4px',
  overflowY: 'auto',
  maxHeight: '300px',
  display: 'flex',
  flexDirection: 'column',

  // Assurer que la colonne prend toute la largeur en mode responsive
  '@media': {
    'screen and (max-width: 480px)': {
      flex: '1 1 100%',
    },
  },
});

/* ----------------------------------------------------------------------------
   Élément sélectionné
   ----------------------------------------------------------------------------*/
export const selectedItem = style({
  color: '#000000',
  backgroundColor: '#e0f3eb', // Surlignage vert clair
  border: `1px solid #13674e`,
});

/* ----------------------------------------------------------------------------
   Barre d'action en masse
   ----------------------------------------------------------------------------*/
export const bulkActionBar = style({
  backgroundColor: '#f9f9f9',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',

  '@media': {
    'screen and (max-width: 480px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '0.5rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   Actions en masse
   ----------------------------------------------------------------------------*/
export const bulkActions = style({
  display: 'flex',
  gap: '0.5rem',

  '@media': {
    'screen and (max-width: 480px)': {
      flexDirection: 'column',
      width: '100%',
    },
  },
});

/* ----------------------------------------------------------------------------
   Bouton d'action en masse
   ----------------------------------------------------------------------------*/
export const bulkButton = style({
  backgroundColor: 'transparent',
  color: '#13674e',
  border: `1px solid #13674e`,
  borderRadius: '4px',
  padding: '0.4rem 0.8rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  fontSize: '0.9rem',

  ':hover': {
    backgroundColor: '#13674e',
    color: '#ffffff',
  },
});

/* ----------------------------------------------------------------------------
   Panneau de prévisualisation
   ----------------------------------------------------------------------------*/
export const previewPanel = style({
  backgroundColor: '#f3f3f3',
  borderRadius: '4px',
  padding: '1rem',
  marginTop: '1rem',
});

/* ----------------------------------------------------------------------------
   Résumé des assignations
   ----------------------------------------------------------------------------*/
export const assignmentsSummary = style({
  margin: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

/* ----------------------------------------------------------------------------
   Pied de la modale
   ----------------------------------------------------------------------------*/
export const modalFooter = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
  marginTop: '1rem',

  '@media': {
    'screen and (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '0.5rem',
    },
    'screen and (max-width: 480px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '0.5rem',
      backgroundColor: '#ffffff',
      paddingTop: '0.5rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   Bouton Annuler
   ----------------------------------------------------------------------------*/
export const cancelButton = style({
  backgroundColor: '#cccccc',
  color: '#ffffff',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',

  ':hover': {
    backgroundColor: '#aaaaaa',
  },
});

/* ----------------------------------------------------------------------------
   Bouton Valider (Assign)
   ----------------------------------------------------------------------------*/
export const assignButton = style({
  backgroundColor: '#13674e', 
  color: '#ffffff', 
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',

  ':hover': {
    backgroundColor: '#0f593e', 
  },

  ':disabled': {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
  },
});

/* ----------------------------------------------------------------------------
   Badge d'interlocuteur principal
   ----------------------------------------------------------------------------*/
export const principalBadge = style({
  display: 'inline-block',
  marginTop: '0.3rem',
  padding: '0.2rem 0.4rem',
  backgroundColor: '#13674e',
  color: '#000000FF',
  fontWeight: 'bold',
  borderRadius: '4px',
});

/* ----------------------------------------------------------------------------
   Vue d'affectation - Membres Welleat
   ----------------------------------------------------------------------------*/
export const assignmentOverview = style({
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',

  '@media': {
    'screen and (max-width: 768px)': {
      flexDirection: 'column',
      gap: '0.8rem',
    },
    'screen and (max-width: 480px)': {
      flexDirection: 'column',
      gap: '0.5rem',
    },
  },
});

/* ----------------------------------------------------------------------------
   Colonne des utilisateurs
   ----------------------------------------------------------------------------*/
export const usersColumn = style({
  flex: '0 0 200px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  padding: '0.5rem',
  border: `1px solid ${vars.colors.border}`,
  overflowY: 'auto',
  maxHeight: '400px',
});

/* ----------------------------------------------------------------------------
   Liste des utilisateurs
   ----------------------------------------------------------------------------*/
export const usersList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',

  '@media': {
    'screen and (max-width: 480px)': {
      display: 'none', 
    },
  },
});

/* ----------------------------------------------------------------------------
   Dropdown des utilisateurs pour petits écrans
   ----------------------------------------------------------------------------*/
export const usersDropdown = style({
  display: 'none',
  '@media': {
    'screen and (max-width: 480px)': {
      display: 'block',
      width: '100%',
      padding: '0.5rem',
      borderRadius: '4px',
      border: `1px solid ${vars.colors.border}`,
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      color: '#000000',
    },
  },
});


/* ----------------------------------------------------------------------------
   Élément de la liste des utilisateurs
   ----------------------------------------------------------------------------*/
   export const memberItem = style({
    color: '#333333',            
    padding: '0.8rem',           
    borderRadius: '4px',
    backgroundColor: '#ffffff',   
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',               
    minHeight: '2.5rem',         
    display: 'flex',             
    alignItems: 'center', 
    justifyContent: 'flex-start',       
    border: '1px solid transparent',
    marginBottom: '0.25rem',     
    fontSize: '1rem',
      
    ':hover': {
      backgroundColor: '#f0f9f6',
      border: '1px solid #13674e',
    }    
  });
    
  export const memberItemSelected = style({
    backgroundColor: '#13674e',
    color: '#ffffff',
    fontWeight: '600',
    border: '2px solid #0a4331',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      
    ':hover': {
      backgroundColor: '#0f593e',
    },
  });
/* ----------------------------------------------------------------------------
   Détails de l'assignation
   ----------------------------------------------------------------------------*/
   export const assignmentDetails = style({
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    padding: '1rem',
    border: `1px solid ${vars.colors.border}`,
    overflowY: 'auto',
    maxHeight: '400px',
  
    '@media': {
      'screen and (max-width: 768px)': {
        maxHeight: 'none',
      },
      'screen and (max-width: 480px)': {
        maxHeight: 'none',
      },
    },
  });
  
  /* ----------------------------------------------------------------------------
     Bloc d'établissement
     ----------------------------------------------------------------------------*/
  export const companyBlock = style({
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    border: `1px solid #cccccc`,
  });
  
  /* ----------------------------------------------------------------------------
     Liste des interlocuteurs
     ----------------------------------------------------------------------------*/
  export const interlocutorsList = style({
    marginTop: '0.5rem',
    paddingLeft: '0.5rem',
    listStyleType: 'none',
  });
  
  /* ----------------------------------------------------------------------------
     Élément de la liste des interlocuteurs
     ----------------------------------------------------------------------------*/
  export const interlocutorItem = style({
    marginBottom: '0.25rem',
    borderBottom: `1px solid ${vars.colors.border}`,
    paddingBottom: '0.5rem',
  });
  
  /* ----------------------------------------------------------------------------
     Liste des interlocuteurs - amélioration de la responsivité
     ----------------------------------------------------------------------------*/
  export const interlocutorDetails = style({
    display: 'flex',
    flexDirection: 'column',
  });
/* ----------------------------------------------------------------------------
   Style des Tabs
   ----------------------------------------------------------------------------*/
export const tabsContainer = style({
  display: 'flex',
  borderBottom: `2px solid ${vars.colors.border}`,
  backgroundColor: '#13674e', 
});

export const tab = style({
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#ffffff', 
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',

  ':hover': {
    backgroundColor: '#0f593e', 
  },

  '@media': {
    'screen and (max-width: 480px)': {
      padding: '0.5rem 1rem',
      fontSize: '0.9rem',
    },
  },
});

export const activeTab = style({
  backgroundColor: '#0f593e', 
  fontWeight: 'bold',
});
