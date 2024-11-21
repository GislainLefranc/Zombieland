// src/services/authService.ts

import axios, { AxiosResponse } from 'axios';
import { User, Login, Register } from "../types";
import api, { getDatas } from '../../services/api'; 

const authService = {
  // Connexion de l'utilisateur
  login: async (data: Login): Promise<User> => {
    try {
      // Obtenir le token via l'instance `api`
      const response: AxiosResponse<{ token: string }> = await api.post('auth/login', data);
      const token = response.data.token;

      if (token) {
        // Stocker le token
        localStorage.setItem('token', token);
        // L'intercepteur dans `api` ajoutera automatiquement le token aux requêtes suivantes

        // Récupérer les informations de l'utilisateur
        const userData: User = await getDatas('users/me');

        // Combiner le token et les données utilisateur
        const loggedInUser = { ...userData, token };

        // Stocker l'utilisateur complet dans le localStorage
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        return loggedInUser;
      }
      throw new Error("Token non reçu");
    } catch (error: unknown) {
      // Gestion des erreurs
      console.error("Erreur lors de la connexion:", error);
      throw new Error("Échec de la connexion");
    }
  },

  // Inscription de l'utilisateur
  register: async (data: Register): Promise<User> => {
    try {
      // Appel à l'endpoint d'inscription via l'instance `api`
      const response: AxiosResponse<User> = await api.post('users', data);
      const registeredUser = response.data;

      if (registeredUser) {
        // Stocker l'utilisateur
        localStorage.setItem('user', JSON.stringify(registeredUser));
      }

      return registeredUser;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Erreur lors de l'inscription - Response data:", error.response?.data || error.message);
      } else {
        console.error("Erreur inconnue:", error);
      }
      throw new Error("Échec de l'inscription");
    }
  },

  // Déconnexion de l'utilisateur
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = ''; 
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr) as User;
    return null;
  },

  // Vérifier si l'utilisateur est connecté
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('user');
  },

  // Mettre à jour le token
  updateToken: (token: string) => {
    const user = authService.getCurrentUser();
    if (user) {
      user.token = token;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
};

export default authService;