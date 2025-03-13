//// Dossier: frontend/src/api, Fichier: axiosInstance.ts

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { cacheAxiosResponse, getCachedResponse } from '../utils/axiosCache';
import { convertKeysToCamelCase } from '../utils/snakeToCamel';

// Création de l'instance Axios avec la configuration de base
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // URL de base de l'API
  headers: {
    'Content-Type': 'application/json', // Format des données envoyées
  },
  timeout: 10000, // Délai d'attente en millisecondes
});

// Intercepteur de requête pour gérer le cache et l'authentification
axiosInstance.interceptors.request.use(
  async (config) => {
    // Générer la clé de cache à partir de la méthode et de l'URL
    const cacheKey = `${config.method}-${config.url}`;

    // Vérifier le cache pour les requêtes GET
    if (config.method === 'get') {
      const cachedData = getCachedResponse(cacheKey);
      if (cachedData) {
        console.log('📦 Données trouvées en cache');
        // Retourner la configuration avec les données en cache et un indicateur __fromCache
        return Promise.resolve({
          ...config,
          data: cachedData,
          __fromCache: true,
        });
      }
    }

    // Ajouter le token d'authentification aux headers si disponible
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const parsedToken = JSON.parse(authToken);
        if (parsedToken.token) {
          config.headers.Authorization = `Bearer ${parsedToken.token}`;
        }
      } catch (e) {
        console.error('Erreur lors du parsing du token:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse pour transformer les données et gérer les erreurs
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Convertir les clés des données de réponse en camelCase
    response.data = convertKeysToCamelCase(response.data);

    // Si la réponse provient du cache, la retourner directement
    if (response.config.__fromCache) {
      return response;
    }

    // Mettre en cache les réponses des requêtes GET
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.method}-${response.config.url}`;
      cacheAxiosResponse(cacheKey, response.data);
    }
    return response;
  },
  (error: AxiosError | any) => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          // Supprimer le token et rediriger vers la page d'accueil pour ré-authentification
          localStorage.removeItem('authToken');
          window.location.href = '/';
          break;
        case 403:
          // Afficher un message d'erreur pour accès non autorisé
          toast.error('Accès non autorisé');
          break;
        default:
          // Afficher un message d'erreur générique
          toast.error(error.response.data?.message || 'Une erreur est survenue');
      }
    } else if (error.request) {
      // Gérer les erreurs liées au réseau
      toast.error('Erreur réseau');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
