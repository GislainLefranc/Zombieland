// Dossier : src/hooks, Fichier : useDebounce.ts
// Ce hook permet de "debouncer" une valeur : il ne la met à jour qu'après un délai défini.
// Utile pour éviter de lancer trop fréquemment une fonction lors de la saisie.

import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour le debounce.
 * Renvoie la valeur débouncée après un délai donné.
 * @param value - Valeur à débouncer.
 * @param delay - Délai en millisecondes.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyage du timeout si la valeur change avant la fin du délai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
