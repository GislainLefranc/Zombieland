//// Dossier : src/components, Fichier : InputField.tsx

import React from 'react';
import * as styles from './InputField.css';

interface InputFieldProps {
  id: string; // Identifiant de l'input
  name: string; // Nom de l'input
  type: string; // Type de l'input (ex: "text", "number", "textarea", etc.)
  label: string; // Libellé affiché pour l'input
  step?: string; // Valeur du pas pour les inputs de type "number"
  value: string | number; // Valeur de l'input
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>; // Fonction appelée lors d'un changement
  variant?: 'profile' | 'simulation'; // Style à appliquer selon le contexte d'utilisation
  readOnly?: boolean; // Indique si l'input est en lecture seule
  labelClass?: string; // Classe CSS additionnelle pour le label
  inputClass?: string; // Classe CSS additionnelle pour l'input
  error?: string; // Message d'erreur à afficher
  required?: boolean; // Indique si le champ est obligatoire
  placeholder?: string; // Texte d'indication dans l'input
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  label,
  step,
  value,
  onChange,
  variant = 'simulation',
  readOnly = false,
  labelClass,
  inputClass,
  error,
  required = false,
  placeholder,
}) => {
  // Vérifie si le variant est "profile"
  const isProfile = variant === 'profile';
  const containerClass = styles.inputFieldContainer;

  // Construction des classes pour le label selon le variant
  const labelClasses =
    variant === 'simulation'
      ? `${styles.inputLabel} ${styles.simulationLabel} ${labelClass || ''}`.trim()
      : `${styles.inputLabel} ${labelClass || ''}`.trim();

  // Construction des classes pour l'input en fonction du variant et de la présence d'erreur
  const inputClasses = `${
    isProfile
      ? readOnly
        ? styles.profileInputReadOnly
        : styles.profileInputEditable
      : styles.simulationInput
  } ${error ? styles.inputError : ''} ${inputClass || ''}`.trim();

  // Propriétés communes pour l'élément input ou textarea
  const commonProps = {
    id,
    name,
    value,
    onChange,
    className: inputClasses,
    readOnly,
    placeholder,
    'aria-required': required,
    'aria-invalid': !!error,
  };

  return (
    <div className={containerClass}>
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea {...commonProps} />
      ) : (
        <input {...commonProps} type={type} step={step} disabled={isProfile && readOnly} />
      )}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputField;
