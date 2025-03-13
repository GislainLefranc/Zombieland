// Dossier : src/components/Common/Tabs
// Fichier : Tabs.tsx
// Ce composant implémente un système d'onglets (Tabs) permettant de changer de contenu en cliquant sur les onglets.
// Chaque onglet (Tab) affiche son contenu et le style change lorsqu'il est actif.

import React from 'react';
import * as styles from './Tabs.css';

interface TabsProps {
  value: string;                     // Valeur de l'onglet actuellement sélectionné
  onChange: (value: string) => void;   // Callback pour changer l'onglet actif
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[]; // Éléments Tab à afficher
  className?: string;
}

interface TabProps {
  value: string;            // Valeur qui identifie l'onglet
  children: React.ReactNode; // Contenu affiché dans l'onglet
  active?: boolean;         // Indique si l'onglet est actif
  onClick?: () => void;     // Fonction déclenchée lors du clic sur l'onglet
}

export const Tabs: React.FC<TabsProps> = ({ value, onChange, children, className }) => {
  return (
    <div className={`${styles.tabsContainer} ${className || ''}`}>
      {React.Children.map(children, (child: React.ReactElement<TabProps>) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            active: child.props.value === value,
            onClick: () => onChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

export const Tab: React.FC<TabProps & { active?: boolean; onClick?: () => void }> = ({
  value,
  children,
  active,
  onClick,
}) => {
  return (
    <button
      className={`${styles.tab} ${active ? styles.activeTab : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
