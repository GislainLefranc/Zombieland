// Import necessary modules and assets (Importation des modules nécessaires et des ressources)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/authContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyImage from '../assets/img/zombie-accueil.webp';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Register = () => {
  // State for form inputs (État pour les champs du formulaire)
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for toggling password visibility (État pour basculer la visibilité des mots de passe)
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // State for password criteria validation (État pour la validation des critères du mot de passe)
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false, // At least 6 characters (Au moins 6 caractères)
    uppercase: false, // At least one uppercase letter (Au moins une lettre majuscule)
    lowercase: false, // At least one lowercase letter (Au moins une lettre minuscule)
    number: false, // At least one number (Au moins un chiffre)
    specialChar: false, // At least one special character (Au moins un caractère spécial)
  });

  // Loading state for form submission (État de chargement pour la soumission du formulaire)
  const [isLoading, setIsLoading] = useState(false);

  // React Router hook for navigation (Hook React Router pour la navigation)
  const navigate = useNavigate();

  // Authentication context for registration and login (Contexte d'authentification pour l'inscription et la connexion)
  const { register, login } = useAuth();

  // Function to validate the password based on predefined criteria (Fonction pour valider le mot de passe selon des critères prédéfinis)
  const validatePassword = (value: string) => {
    setPasswordCriteria({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[@$!%*?&]/.test(value),
    });
    setPassword(value);
  };

  // Function to handle form submission (Fonction pour gérer la soumission du formulaire)
  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if all password criteria are met (Vérifier si tous les critères du mot de passe sont remplis)
    if (Object.values(passwordCriteria).some((criterion) => !criterion)) {
      toast.error('Votre mot de passe ne respecte pas les critères.');
      return;
    }

    // Check if passwords match (Vérifier si les mots de passe correspondent)
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !');
      return;
    }

    setIsLoading(true);
    try {
      // Register the user (Enregistrer l'utilisateur)
      await register({ firstname, lastname, email, password });
      toast.success("Inscription réussie ! Redirection vers la page d'accueil...");

      // Log the user in after successful registration (Connecter l'utilisateur après une inscription réussie)
      await login({ email, password });

      // Redirect to the home page (Rediriger vers la page d'accueil)
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      // Handle registration error (Gérer les erreurs d'inscription)
      toast.error("Échec de l'inscription. Veuillez réessayer.");
      console.error("Erreur d'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full">
        {/* Left container for the form (Conteneur gauche pour le formulaire) */}
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Inscrivez-vous</h2>
              <p className="mt-2 text-sm text-gray-500">
                Vous avez déjà un compte ?{' '}
                <a href="/login" className="font-semibold text-red-primary hover:text-red-secondary">
                  Connectez-vous
                </a>
              </p>
            </div>

            <div className="mt-10">
              <form onSubmit={handleSubmitRegister} className="space-y-6">
                {/* First name input (Champ pour le prénom) */}
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-900">Prénom</label>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    autoComplete="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                  />
                </div>

                {/* Last name input (Champ pour le nom) */}
                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-900">Nom</label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    autoComplete="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                  />
                </div>

                {/* Email input (Champ pour l'email) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                  />
                </div>

                {/* Password input with toggle visibility (Champ pour le mot de passe avec visibilité basculable) */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">Mot de passe</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => validatePassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                    >
                      <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
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

                {/* Confirm password input with toggle visibility (Champ pour confirmer le mot de passe avec visibilité basculable) */}
                <div>
                  <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-900">Confirmation de mot de passe</label>
                  <div className="relative">
                    <input
                      id="confirmpassword"
                      name="confirmpassword"
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      required
                      autoComplete="confirmpassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                    >
                      <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
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
                    {isLoading ? 'Inscription...' : `S'inscrire`}
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

export default Register;
