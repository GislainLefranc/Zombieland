/*
  Dossier : src/Pages
  Fichier : ResetPasswordPage.tsx
  Ce composant gère la réinitialisation du mot de passe via un token.
*/

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import SiteLogo from '../../components/SiteLogo/SiteLogo';
import Button from '../../components/Button/Button';
import * as styles from './../LoginPage/LoginPage.css';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // États pour le token, le mot de passe, la confirmation et le chargement
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Extraction du token depuis l'URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenParam = query.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error('Token de réinitialisation manquant');
      navigate('/');
    }
  }, [location.search, navigate]);

  // Soumission du formulaire de réinitialisation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', { token, password });
      toast.success('Mot de passe réinitialisé avec succès ! Redirection vers la connexion...');
      setTimeout(() => navigate('/'), 3000);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContent}>
      <SiteLogo responsive={false} />
      <h2 className={styles.loginTitle}>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Entrez votre nouveau mot de passe"
            className={styles.loginInput}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirmez votre nouveau mot de passe"
            className={styles.loginInput}
            required
          />
        </div>
        <Button
          variant="login"
          size="medium"
          text={loading ? 'Réinitialisation...' : 'Réinitialiser le Mot de Passe'}
          disabled={loading}
          type="submit"
          className={styles.loginButton}
        />
      </form>
    </div>
  );
};

export default ResetPasswordPage;
