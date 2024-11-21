import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyImage from '../assets/img/zombie-accueil.webp';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === '') {
        toast.error('Veuillez entrer une adresse e-mail.');
        return;
    }

    if (!validateEmail(email)) {
        toast.error('Veuillez entrer une adresse e-mail respectant les critères.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/request-password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            toast.success('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
            setTimeout(() => navigate('/login'), 3000);
        } else {
            const errorData = await response.json();
            toast.error(errorData.message || 'Une erreur est survenue. Veuillez réessayer.');
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
        toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
};

  return (
    <div className="flex min-h-full">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">Mot de passe oublié</h2>
            <p className="mt-2 text-sm/6 text-gray-500">
              Entrez l'adresse email associé à votre compte pour modifier votre mot de passe.{' '}
              Retournez à la{' '}
              <a href="/login" className="font-semibold text-red-primary hover:text-red-secondary">
                connexion
              </a>
              .
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Adresse e-mail
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-red-primary px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary"
                >
                  Envoyer le lien de réinitialisation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative flex-1 max-lg:hidden w-0">
        <img
          alt=""
          src={MyImage}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
