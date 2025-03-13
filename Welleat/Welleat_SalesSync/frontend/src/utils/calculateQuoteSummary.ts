import { toNumber } from "./formatFormula";
import { FormulaDetails } from "../types/index";
import { QuoteEquipmentLine } from "../types/quotesTypes";

/**
 * Interface décrivant les valeurs calculées pour le résumé d'un devis.
 */
export interface QuoteSummaryValues {
  discountBase: number;
  computedDiscountValueHT: number;
  computedFinalCostHT: number;
  computedFinalCostTTC: number;
  computedFirstMonthCostHT: number;
  computedFirstMonthCostTTC: number;
  computedOverallCostHT: number;
  computedOverallCostTTC: number;
}

/**
 * Calcule les différentes valeurs résumées d'un devis.
 * Le coût des options est inclus dans le tarif mensuel récurrent.
 *
 * @param params.selectedFormula - La formule sélectionnée (ou null).
 * @param params.installationOneTime - Indique si l'installation est facturée une seule fois.
 * @param params.discountPercentage - Pourcentage de remise (ex. 20 pour 20 %).
 * @param params.engagementDuration - Durée d'engagement en mois.
 * @param params.taxRate - Taux de TVA (ex. 20 pour 20 %).
 * @param params.equipments - Liste des équipements ajoutés au devis.
 * @returns Un objet contenant les valeurs calculées.
 */
export const calculateQuoteSummary = (params: {
  selectedFormula: FormulaDetails | null;
  installationOneTime: boolean;
  discountPercentage: number;
  engagementDuration: number;
  taxRate: number;
  equipments: QuoteEquipmentLine[];
}): QuoteSummaryValues => {
  const {
    selectedFormula,
    installationOneTime,
    discountPercentage,
    engagementDuration,
    taxRate,
    equipments,
  } = params;
  const effectiveTaxRate = taxRate || 20;

  // Calcul du coût total de la formule, incluant les options
  const formulaCost = selectedFormula
    ? toNumber(selectedFormula.installation_price) +
      toNumber(selectedFormula.maintenance_price) +
      toNumber(selectedFormula.hotline_price) +
      (selectedFormula.options
        ? selectedFormula.options.reduce((sum, opt) => sum + toNumber(opt.price_ht), 0)
        : 0)
    : 0;

  // Si installationOneTime est activé, retirer le coût d'installation pour obtenir le coût mensuel récurrent
  const recurringFormulaCost =
    installationOneTime && selectedFormula
      ? formulaCost - toNumber(selectedFormula.installation_price)
      : formulaCost;

  // Calcul du total des équipements en tenant compte de la gratuité
  const computedTotalEquipments = equipments.reduce((sum, eq) => {
    const unitPrice = eq.equipment ? toNumber(eq.equipment.price_ht) : toNumber(eq.price);
    const effectiveQty = eq.isFirstUnitFree && eq.quantity > 1 ? eq.quantity - 1 : eq.quantity;
    return sum + unitPrice * effectiveQty;
  }, 0);

  // Base de calcul pour la remise mensuelle
  const discountBase = recurringFormulaCost + computedTotalEquipments;
  const computedDiscountValueHT = discountBase * (discountPercentage / 100);

  // Tarif mensuel final après remise (hors installation)
  const computedFinalCostHT = discountBase - computedDiscountValueHT;
  const computedFinalCostTTC = computedFinalCostHT * (1 + effectiveTaxRate / 100);

  // Coût du premier mois = tarif mensuel final + installation (si applicable)
  const computedFirstMonthCostHT = installationOneTime
    ? computedFinalCostHT + toNumber(selectedFormula?.installation_price)
    : computedFinalCostHT;
  const computedFirstMonthCostTTC = computedFirstMonthCostHT * (1 + effectiveTaxRate / 100);

  // Coût total sur l'engagement
  const computedOverallCostHT =
    computedFinalCostHT * engagementDuration +
    (installationOneTime ? toNumber(selectedFormula?.installation_price) : 0);
  const computedOverallCostTTC = computedOverallCostHT * (1 + effectiveTaxRate / 100);

  return {
    discountBase,
    computedDiscountValueHT,
    computedFinalCostHT,
    computedFinalCostTTC,
    computedFirstMonthCostHT,
    computedFirstMonthCostTTC,
    computedOverallCostHT,
    computedOverallCostTTC,
  };
};
