// Dossier : src/hooks, Fichier : useFormulas.ts
// Ce hook permet de récupérer les formules depuis l'API et de les formater correctement
// en convertissant les valeurs de prix en nombres et en calculant le prix TTC si nécessaire.

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Formula } from '../types';

const TAX_RATE = 0.20; // Taux de TVA

/**
 * Fonction utilitaire pour convertir une valeur de prix (avec virgule ou point) en nombre.
 * @param value - Valeur à convertir.
 * @returns Le nombre converti.
 */
const parsePrice = (value: string | number): number => {
  if (typeof value === 'string') {
    const normalized = value.replace(',', '.');
    return parseFloat(normalized);
  }
  return Number(value);
};

/**
 * Hook personnalisé pour récupérer les formules depuis l'API.
 */
const useFormulas = () => {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère les formules via l'API et convertit les prix en nombres.
   */
  const fetchFormulas = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/formulas');
      if (!response.data?.data || !Array.isArray(response.data.data)) {
        throw new Error('Données de formules non valides');
      }
      const formulasData: Formula[] = response.data.data.map((formula: any) => {
        const priceHTNum = parsePrice(formula.price_ht || formula.priceHt) || 0;
        let priceTTCNum = parsePrice(formula.price_ttc || formula.priceTtc);
        if (!priceTTCNum || isNaN(priceTTCNum)) {
          priceTTCNum = priceHTNum * (1 + TAX_RATE);
        }
        return {
          ...formula,
          price_ht: priceHTNum,
          price_ttc: priceTTCNum,
          installation_price: parsePrice(formula.installation_price || formula.installationPrice) || 0,
          maintenance_price: parsePrice(formula.maintenance_price || formula.maintenancePrice) || 0,
          hotline_price: parsePrice(formula.hotline_price || formula.hotlinePrice) || 0,
        };
      });
      setFormulas(formulasData);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des formules:', err);
      setError(err.message || 'Erreur lors de la récupération des formules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormulas();
  }, []);

  return { formulas, loading, error, fetchFormulas };
};

export { parsePrice };
export default useFormulas;
