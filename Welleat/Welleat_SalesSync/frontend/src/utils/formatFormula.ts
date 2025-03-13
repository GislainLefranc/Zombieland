/**
 * Interface décrivant les détails d'une formule.
 */
interface FormulaDetails {
  id: number;
  name: string;
  description?: string;
  installation_price: number;
  maintenance_price: number;
  hotline_price: number;
  options: Array<{
    id: number;
    name: string;
    price_ht: number;
    price_ttc?: number;
  }>;
}

/**
 * Fonction utilitaire pour convertir une valeur en nombre.
 * Remplace la virgule par un point et retourne 0 si la conversion échoue.
 * @param val - Valeur à convertir.
 * @returns Le nombre converti.
 */
export const toNumber = (val: any): number =>
  parseFloat(String(val).replace(',', '.')) || 0;

/**
 * Transforme les données brutes d'une formule en un objet FormulaDetails cohérent.
 * Cette fonction garantit une conversion uniforme des champs.
 * @param formula - Données brutes de la formule.
 * @returns Un objet FormulaDetails ou null si aucune formule n'est fournie.
 */
export const formatFormulaData = (formula: any): FormulaDetails | null => {
  if (!formula) return null;
  return {
    id: formula.id,
    name: formula.name,
    installation_price: toNumber(formula.installation_price),
    maintenance_price: toNumber(formula.maintenance_price),
    hotline_price: toNumber(formula.hotline_price),
    options: (formula.options || []).map((opt: any) => ({
      id: opt.id,
      name: opt.name,
      price_ht: toNumber(opt.price_ht),
    })),
  };
};
