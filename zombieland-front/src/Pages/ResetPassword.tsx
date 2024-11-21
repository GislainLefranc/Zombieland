// Import necessary modules and assets (Importation des modules nécessaires et des ressources)
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyImage from '../assets/img/zombie-accueil.webp';

const ResetPassword = () => {
  // State for the new password and its validation criteria (État pour le nouveau mot de passe et ses critères de validation)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false, // At least 6 characters (Au moins 6 caractères)
    uppercase: false, // At least one uppercase letter (Au moins une lettre majuscule)
    lowercase: false, // At least one lowercase letter (Au moins une lettre minuscule)
    number: false, // At least one number (Au moins un chiffre)
    specialChar: false, // At least one special character (Au moins un caractère spécial)
  });

  // State for toggling password visibility (État pour basculer la visibilité des mots de passe)
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Loading state for the form submission (État de chargement pour la soumission du formulaire)
  const [isLoading, setIsLoading] = useState(false);

  // React Router hooks for navigation and query parameters (Hooks React Router pour la navigation et les paramètres de requête)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Function to validate the password based on predefined criteria (Fonction pour valider le mot de passe selon des critères prédéfinis)
  const validatePassword = (value: string) => {
    setPasswordCriteria({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[@$!%*?&]/.test(value),
    });
    setNewPassword(value);
  };

  // Function to handle form submission (Fonction pour gérer la soumission du formulaire)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if all password criteria are met (Vérifier si tous les critères du mot de passe sont remplis)
    if (Object.values(passwordCriteria).some((criterion) => !criterion)) {
      toast.error('Votre mot de passe ne respecte pas les critères.');
      return;
    }

    // Check if passwords match (Vérifier si les mots de passe correspondent)
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !');
      return;
    }

    // Retrieve the token from the URL (Récupérer le token depuis l'URL)
    const token = searchParams.get('token');
    if (!token) {
      toast.error('Token invalide ou manquant.');
      return;
    }

    setIsLoading(true);
    try {
      // Send the reset password request (Envoyer la requête de réinitialisation du mot de passe)
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken: token, newPassword }),
      });

      // Handle server response (Gérer la réponse du serveur)
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur serveur:', errorText);
        toast.error('Erreur lors de la réinitialisation du mot de passe.');
        return;
      }

      const data = await response.json();
      toast.success(data.message || 'Mot de passe réinitialisé avec succès.');
      setTimeout(() => {
        navigate('/login'); // Redirect to the login page (Rediriger vers la page de connexion)
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      toast.error('Erreur serveur, veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Left container for the form (Conteneur gauche pour le formulaire) */}
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Réinitialisation du mot de passe</h2>
              <p className="mt-2 text-sm text-gray-500">
                Vous vous souvenez de votre mot de passe ?{' '}
                <a href="/login" className="font-semibold text-red-primary hover:text-red-secondary">
                  Connectez-vous
                </a>
              </p>
            </div>

            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New password input with toggle visibility (Entrée pour le nouveau mot de passe avec visibilité basculable) */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-900">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      name="new-password"
                      type={passwordVisible ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => validatePassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordVisible ? '✳️' : '👁️'}
                    </button>
                  </div>
                  <ul className="mt-2 text-sm space-y-1">
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
                </div>

                {/* Confirm password input with toggle visibility (Entrée pour confirmer le mot de passe avec visibilité basculable) */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      required
                      autoComplete="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                    >
                      {confirmPasswordVisible ? '✳️' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Submit button (Bouton de soumission) */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-red-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary"
                  >
                    {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right container with background image (Conteneur droit avec image d'arrière-plan) */}
        <div className="relative flex-1 hidden lg:block">
          <img
            alt=""
            src={MyImage}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
