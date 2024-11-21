// Import required modules and assets (Importation des modules nécessaires et des ressources)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import MyImage from '../assets/img/zombie-accueil.webp';
import { useAuth } from '../Auth/authContext';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Login = () => {
  // State for email and password inputs (État pour les champs de l'email et du mot de passe)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for toggling password visibility (État pour basculer la visibilité du mot de passe)
  const [passwordVisible, setPasswordVisible] = useState(false);

  // State for tracking login errors (État pour suivre les erreurs de connexion)
  const [error, setError] = useState('');

  // State for form submission loading (État de chargement pour la soumission du formulaire)
  const [isLoading, setIsLoading] = useState(false);

  // React Router hook for navigation (Hook React Router pour la navigation)
  const navigate = useNavigate();

  // Authentication context (Contexte d'authentification)
  const { login } = useAuth();

  // Function to validate email format (Fonction pour valider le format de l'email)
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to handle form submission (Fonction pour gérer la soumission du formulaire)
  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate email format (Validation du format de l'email)
    if (!validateEmail(email)) {
      toast.error('Veuillez entrer une adresse e-mail valide.');
      setIsLoading(false);
      return;
    }

    try {
      // Attempt login (Tentative de connexion)
      await login({ email, password });

      // Success toast notification (Notification de succès)
      toast.success('Connexion réussie ! Vous allez être redirigé.');

      // Redirect after successful login (Redirection après une connexion réussie)
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      // Error handling (Gestion des erreurs)
      toast.error('Échec de la connexion. Vérifiez vos identifiants.');
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full">
        {/* Left container for login form (Conteneur gauche pour le formulaire de connexion) */}
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Connectez-vous</h2>
              <p className="mt-2 text-sm text-gray-500">
                Pas encore inscrit ?{' '}
                <a href="/register" className="font-semibold text-red-primary hover:text-red-secondary">
                  Inscrivez-vous
                </a>
              </p>
            </div>

            <div className="mt-10">
              <div>
                <form onSubmit={handleSubmitLogin} className="space-y-6">
                  {/* Email input (Champ pour l'email) */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Password input with toggle visibility (Champ pour le mot de passe avec visibilité basculable) */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                      Mot de passe
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={passwordVisible ? 'text' : 'password'} // Toggles between 'text' and 'password' (Basculer entre 'texte' et 'mot de passe')
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility (Basculer la visibilité du mot de passe)
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                      >
                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>

                  {/* Remember me and forgot password (Se souvenir de moi et mot de passe oublié) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-red-primary focus:ring-red-primary"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">
                        Se souvenir de moi
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="/forgot-password" className="font-semibold text-red-primary hover:text-red-secondary">
                        Mot de passe oublié ?
                      </a>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  {/* Submit button (Bouton de soumission) */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex w-full justify-center rounded-md bg-red-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary"
                    >
                      {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right container with background image (Conteneur droit avec image d'arrière-plan) */}
        <div className="relative flex-1 max-lg:hidden w-0">
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

export default Login;
