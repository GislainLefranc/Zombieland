// filepath: /c:/Users/docje/OneDrive/Documents/Code/Welleat/Welleat_Compare/frontend/src/styles/icons/StarIcon.tsx
import React, { memo } from 'react';

interface StarIconProps {
  isActive: boolean;
  onClick: () => void;
  title?: string;
  disabled?: boolean; 
}

const StarIcon: React.FC<StarIconProps> = memo(
  ({ isActive, onClick, title, disabled = false }) => {
    return (
      <span
        onClick={disabled ? undefined : onClick}
        style={{
          cursor: disabled ? 'default' : 'pointer',
          color: isActive ? '#FFCF01' : '#808080',
          fontSize: '24px',
          marginLeft: '10px',
          opacity: disabled ? 0.7 : 1
        }}
        title={title}
      >
        ★
      </span>
    );
  }
);

StarIcon.displayName = 'StarIcon';

export default StarIcon;