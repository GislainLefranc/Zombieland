// Dossier : src/hooks, Fichier : useOptions.ts
// Ce hook personnalisé récupère les options depuis l'API et les formate en convertissant les prix en nombres.

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Option } from '../types';

/**
 * Hook personnalisé pour récupérer les options.
 */
export const useOptions = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/options');
      const optionsData = response.data.data || [];
      const formattedOptions: Option[] = optionsData.map((option: any) => ({
        ...option,
        price_ht: Number(option.price_ht || option.priceHt) || 0,
        price_ttc: Number(option.price_ttc || option.priceTtc) || 0,
      }));
      setOptions(formattedOptions);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des options:', err);
      setError(err.message || 'Erreur lors de la récupération des options');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return { options, loading, error, fetchOptions };
};

export default useOptions;
