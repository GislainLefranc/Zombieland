import React from 'react';
import {
  primaryButton,
  secondaryButton,
  dangerButton,
  submitButton,
  addButton,
  assignDashboardButton,
  calculateButton,
  simulationButton,
  loginButton,
  assignButton,
  cancelButton,
  modalCancelBtn,
  modalSendBtn,
  modalDangerBtn,
  smallButton,
  mediumButton,
  largeButton,
  responsiveButton,
} from '../../styles/Buttons/Buttons.css';

export interface ButtonProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'submit'
    | 'add'
    | 'calculate'
    | 'simulation'
    | 'login'
    | 'assign'
    | 'cancel'
    | 'modalCancel'
    | 'modalSend'
    | 'assignDashboard'
    | 'modalDanger';
  size?: 'small' | 'medium' | 'large';
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  text,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  let variantClass;
  switch (variant) {
    case 'primary':
      variantClass = primaryButton;
      break;
    case 'secondary':
      variantClass = secondaryButton;
      break;
    case 'danger':
    case 'modalDanger':
      variantClass = dangerButton;
      break;
    case 'submit':
      variantClass = submitButton;
      break;
    case 'add':
      variantClass = addButton;
      break;
    case 'assignDashboard':
      variantClass = assignDashboardButton;
      break;
    case 'calculate':
      variantClass = calculateButton;
      break;
    case 'simulation':
      variantClass = simulationButton;
      break;
    case 'login':
      variantClass = loginButton;
      break;
    case 'assign':
      variantClass = assignButton;
      break;
    case 'cancel':
      variantClass = cancelButton;
      break;
    case 'modalCancel':
      variantClass = modalCancelBtn;
      break;
    case 'modalSend':
      variantClass = modalSendBtn;
      break;
    default:
      variantClass = primaryButton;
      break;
  }

  let sizeClass;
  switch (size) {
    case 'small':
      sizeClass = smallButton;
      break;
    case 'large':
      sizeClass = largeButton;
      break;
    case 'medium':
    default:
      sizeClass = mediumButton;
      break;
  }

  return (
    <button
      type={type}
      className={`${variantClass} ${sizeClass} ${responsiveButton} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
