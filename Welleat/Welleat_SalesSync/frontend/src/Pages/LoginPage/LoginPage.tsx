// Dossier : src/Pages/LoginPage | Fichier : LoginPage.tsx
// Ce composant gère l'authentification de l'utilisateur.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SiteLogo from '../../components/SiteLogo/SiteLogo';
import Button from '../../components/Button/Button';
import * as styles from './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Gestion de la soumission du formulaire de connexion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la connexion');
      }
      const { token } = await response.json();
      await login(token, 3600);
      toast.success('Connexion réussie !', { autoClose: 3000 });
      setTimeout(() => navigate('/homepage'), 3000);
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
      console.error('Erreur lors de la connexion:', error);
    }
  };

  return (
    <div className={styles.loginContent}>
      <SiteLogo responsive={false} />
      <h2 className={styles.loginTitle}>Connectez-vous</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Entrez votre e-mail"
            className={styles.loginInput}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            className={styles.loginInput}
            required
          />
        </div>
        <Button
          variant="login"
          size="medium"
          text="Valider"
          type="submit"
          className={styles.loginButton}
        />
      </form>
    </div>
  );
};

export default LoginPage;
