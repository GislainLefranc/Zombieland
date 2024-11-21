import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { updateDataPassword } from '../services/api';
import { toast } from 'react-toastify';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: number; password: string };
}

const PasswordModal: React.FC<ModalProps> = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({ password: '', passwordVerif: '' });
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (value: string) => {
    setPasswordCriteria({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[@$!%*?&]/.test(value),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      validatePassword(value);
    }

    if (name === 'passwordVerif') {
      setError(value !== formData.password ? 'Les mots de passe ne correspondent pas.' : '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordVerif) {
      toast.error('Les mots de passe ne correspondent pas !');
      return;
    }

    await updateDataPassword('auth/update-password', user.id, { password: formData.password });
    toast.success('Mot de passe modifié avec succès.');

    setError('');
    setFormData({ password: '', passwordVerif: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyUp={(e) => e.key === 'Escape' && onClose()}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Modifier votre mot de passe</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='password' className="block text-sm font-medium">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full mt-1 rounded-md"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-2 top-2"
              >
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="passwordVerif" className="block text-sm font-medium">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="passwordVerif"
                name="passwordVerif"
                value={formData.passwordVerif}
                onChange={handleChange}
                className="block w-full mt-1 rounded-md"
              />
              <button
                type="button"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className="absolute right-2 top-2"
              >
                <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <ul className="mt-2 text-sm">
          <li className={passwordCriteria.length ? 'text-green-500' : 'text-red-500'}>
                  {passwordCriteria.length ? '✔️' : '❌'} Au moins 6 caractères
              </li>
              <li className={passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'}>
                  {passwordCriteria.uppercase ? '✔️' : '❌'} Une lettre majuscule
              </li>
              <li className={passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'}>
                  {passwordCriteria.lowercase ? '✔️' : '❌'} Une lettre minuscule
              </li>
              <li className={passwordCriteria.number ? 'text-green-500' : 'text-red-500'}>
                  {passwordCriteria.number ? '✔️' : '❌'} Un chiffre
              </li>
              <li className={passwordCriteria.specialChar ? 'text-green-500' : 'text-red-500'}>
                  {passwordCriteria.specialChar ? '✔️' : '❌'} Un caractère spécial (@$!%*?&)
              </li>
          </ul>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;