// Dossier : src/hooks, Fichier : useSimulationForm.ts
// Ce hook gère le formulaire de simulation en stockant les valeurs et en calculant les résultats.
// Il fournit également une fonction handleChange pour mettre à jour les valeurs du formulaire.

import { useState } from 'react';

interface SimulationFormValues {
  costPerDish: number;
  dishesPerDay: number;
  wastePercentage: number;
}

export interface SimulationResults {
  dailyProductionSavings: number;
  monthlyProductionSavings: number;
  dailyWasteSavings: number;
  monthlyWasteSavings: number;
}

/**
 * Interface du résultat retourné par le hook useSimulationForm.
 */
interface UseSimulationFormResult {
  values: SimulationFormValues;
  setValues: React.Dispatch<React.SetStateAction<SimulationFormValues>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  calculateResults: () => SimulationResults;
}

/**
 * Hook personnalisé pour gérer le formulaire de simulation.
 * @param initialValues - Valeurs initiales du formulaire.
 * @returns Un objet contenant les valeurs, fonctions de gestion et résultats calculés.
 */
export const useSimulationForm = (
  initialValues: SimulationFormValues
): UseSimulationFormResult => {
  const [values, setValues] = useState<SimulationFormValues>(initialValues);

  /**
   * Met à jour la valeur d'un champ dans le formulaire.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: parseFloat(value) || 0,
    }));
  };

  /**
   * Calcule les résultats de la simulation à partir des valeurs du formulaire.
   * @returns Un objet contenant les économies journalières et mensuelles.
   */
  const calculateResults = (): SimulationResults => {
    const { costPerDish, dishesPerDay, wastePercentage } = values;
    const productionSavingsRate = 0.14;
    const wasteReductionRate = 0.45;
    const workingDaysPerMonth = 18;

    const dailyProductionSavings = parseFloat(
      (costPerDish * dishesPerDay * productionSavingsRate).toFixed(2)
    );
    const monthlyProductionSavings = parseFloat(
      (dailyProductionSavings * workingDaysPerMonth).toFixed(2)
    );
    const dailyWasteSavings = parseFloat(
      (
        costPerDish *
        dishesPerDay *
        (wastePercentage / 100) *
        wasteReductionRate
      ).toFixed(2)
    );
    const monthlyWasteSavings = parseFloat(
      (dailyWasteSavings * workingDaysPerMonth).toFixed(2)
    );

    return {
      dailyProductionSavings,
      monthlyProductionSavings,
      dailyWasteSavings,
      monthlyWasteSavings,
    };
  };

  return {
    values,
    setValues,
    handleChange,
    calculateResults,
  };
};
