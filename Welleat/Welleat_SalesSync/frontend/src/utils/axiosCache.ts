import { AxiosResponse } from 'axios';

interface CacheItem {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheItem>();
const CACHE_DURATION = 5 * 60 * 1000; // Durée de cache : 5 minutes

/**
 * Met en cache la réponse Axios associée à une clé donnée.
 * @param key - Clé pour stocker la réponse.
 * @param response - Réponse Axios.
 */
export const cacheAxiosResponse = (key: string, response: AxiosResponse) => {
  cache.set(key, {
    data: response.data,
    timestamp: Date.now(),
  });
};

/**
 * Récupère la réponse mise en cache pour une clé donnée, si elle n'est pas expirée.
 * @param key - Clé de la réponse en cache.
 * @returns Les données mises en cache ou null si expirées/inexistantes.
 */
export const getCachedResponse = (key: string) => {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return item.data;
};
