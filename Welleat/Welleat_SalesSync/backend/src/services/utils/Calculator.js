// Dossier : src/services/utils
// Fichier : Calculator.js
// Service pour les calculs pour les devis

const { Formula } = require('../../models/indexModels');
const TAX_RATE = require('./taxConfig');
const logger = require('../../utils/logger');
const { sequelize } = require('../../config/sequelize');
const TAX_RATE_DEFAULT = TAX_RATE;
const Decimal = require('decimal.js');

// Configuration de Decimal.js pour 2 décimales
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

/**
 * Convertit une valeur en Decimal.
 *
 * @param {number|string} value - Valeur à convertir.
 * @returns {Decimal}
 */
const toDecimal = (value) => new Decimal(value || 0);

/**
 * Calcule le prix TTC à partir d'un prix HT.
 *
 * @param {number} price_ht - Prix hors taxe.
 * @param {number} taxRate - Taux de TVA.
 * @returns {number} Prix TTC arrondi à deux décimales.
 */
function calculatePriceTTC(price_ht, taxRate = TAX_RATE_DEFAULT) {
  return parseFloat((price_ht * (1 + taxRate / 100)).toFixed(2));
}

/**
 * Calcule les totaux HT et TTC à partir des prix.
 *
 * @param {object} prices - Objet contenant price_ht et tax_rate.
 * @returns {object} Totaux HT et TTC.
 */
function calculateTotals(prices) {
  const price_ht = parseFloat(prices.price_ht) || 0;
  const taxRate = parseFloat(prices.tax_rate) || TAX_RATE;
  const price_ttc = price_ht * (1 + taxRate / 100);
  return { price_ht, price_ttc };
}

/**
 * Calcule les totaux de la formule en incluant les options.
 *
 * @param {object} formulaData - Données de la formule.
 * @param {Array} options - Liste des options associées.
 * @returns {object} Totaux calculés.
 */
function calculateFormulaTotals(formulaData, options = []) {
  let base_total_ht = parseFloat(formulaData.installation_price) || 0;
  base_total_ht += parseFloat(formulaData.maintenance_price) || 0;
  base_total_ht += parseFloat(formulaData.hotline_price) || 0;
  options.forEach(option => {
    base_total_ht += parseFloat(option.price_ht) || 0;
  });
  const taxRate = parseFloat(formulaData.tax_rate) || TAX_RATE;
  const total_ttc = base_total_ht * (1 + taxRate / 100);
  return { base_total_ht, total_ttc };
}

/**
 * Calcule le sous-total des équipements.
 *
 * @param {Array} equipments - Liste des équipements.
 * @returns {number} Sous-total calculé.
 */
function calculateSubTotal(equipments) {
  if (!equipments || !Array.isArray(equipments)) {
    return 0;
  }
  return equipments.reduce((total, item) => {
    const unitPrice = parseFloat(item.price_ht) || 0;
    const quantity = item.QuoteEquipment 
      ? (item.QuoteEquipment.is_first_unit_free 
          ? Math.max(0, item.QuoteEquipment.quantity - 1) 
          : item.QuoteEquipment.quantity)
      : 0;
    return total + unitPrice * quantity;
  }, 0);
}

/**
 * Calcule le total après application de la remise.
 *
 * @param {number} subTotal - Sous-total.
 * @param {string} discountType - Type de remise ('percentage' ou 'fixed_amount').
 * @param {number} discountValue - Valeur de la remise.
 * @returns {number} Total après remise.
 */
function calculateTotalWithDiscount(subTotal, discountType, discountValue) {
  if (!discountType || discountValue === undefined) return subTotal;
  if (discountType === 'percentage') {
    return subTotal * (1 - discountValue / 100);
  }
  if (discountType === 'fixed_amount') {
    return Math.max(0, subTotal - parseFloat(discountValue));
  }
  return subTotal;
}

/**
 * Calcule le total HT des équipements en tenant compte de la gratuité de la première unité.
 *
 * @param {Array} equipments - Liste des équipements.
 * @returns {number} Total HT des équipements.
 */
function calculateEquipmentsTotal(equipments) {
  if (!equipments || !Array.isArray(equipments)) {
    return 0;
  }
  return equipments.reduce((total, eq) => {
    const unitPrice = parseFloat(eq.price_ht) || 0;
    const quantity = eq.QuoteEquipment?.quantity || 0;
    const isFirstUnitFree = eq.QuoteEquipment?.is_first_unit_free || false;
    const billableQuantity = isFirstUnitFree ? Math.max(0, quantity - 1) : quantity;
    return total + (unitPrice * billableQuantity);
  }, 0);
}

/**
 * Recalcule les totaux HT et TTC d'un devis et met à jour le devis.
 * La remise est appliquée uniquement sur la partie récurrente.
 *
 * @param {object} quote - Instance du devis.
 * @param {object} transaction - Transaction Sequelize (optionnelle).
 * @returns {Promise<object>} Devis mis à jour.
 * @throws {Error} En cas d'erreur de calcul.
 */
async function recalculateTotals(quote, transaction = null) {
  try {
    if (!quote || !quote.id) {
      throw new Error('Quote invalide ou ID manquant');
    }
    if (quote._recalculating) return quote;
    quote._recalculating = true;

    const Formula = sequelize.model('Formula');
    const formula = await Formula.findByPk(quote.formula_id, {
      include: [{ model: sequelize.model('Option'), as: 'options' }],
      transaction,
      raw: false,
      nest: true,
    });

    if (!formula) {
      throw new Error(`Formule ${quote.formula_id} non trouvée`);
    }

    const installationPrice = toDecimal(formula.installation_price);
    const maintenancePrice = toDecimal(formula.maintenance_price);
    const hotlinePrice = toDecimal(formula.hotline_price);
    const optionsSum = (formula.options || []).reduce((sum, opt) => {
      const optionPrice = toDecimal(opt.price_ht);
      logger.debug(`Option ${opt.name} : ${optionPrice.toString()}`);
      return sum.plus(optionPrice);
    }, toDecimal(0));

    logger.debug('Total Options :', optionsSum.toString());

    let equipmentTotal = toDecimal(0);
    if (quote.equipments?.length > 0) {
      equipmentTotal = quote.equipments.reduce((total, eq) => {
        const unitPrice = toDecimal(eq.price_ht || 0);
        const quantity = toDecimal(eq.QuoteEquipment?.quantity || 0);
        const isFirstUnitFree = eq.QuoteEquipment?.is_first_unit_free === true;
      
        let billableQuantity;
        if (isFirstUnitFree && quantity.equals(1)) {
          billableQuantity = toDecimal(0);
        } else if (isFirstUnitFree) {
          billableQuantity = quantity.minus(1);
        } else {
          billableQuantity = quantity;
        }
      
        const equipmentCost = unitPrice.times(billableQuantity);
      
        logger.debug(`Équipement ${eq.name} :`, {
          prix: unitPrice.toString(),
          quantité: quantity.toString(),
          gratuité: isFirstUnitFree,
          facturé: billableQuantity.toString(),
          coût: equipmentCost.toString()
        });
      
        return total.plus(equipmentCost);
      }, toDecimal(0));
    }

    logger.debug('Total Équipements après gratuité :', equipmentTotal.toString());

    const recurringBaseCost = maintenancePrice
      .plus(hotlinePrice)
      .plus(optionsSum)
      .plus(equipmentTotal);

    logger.debug('Base mensuelle avant installation :', {
      maintenance: maintenancePrice.toString(),
      hotline: hotlinePrice.toString(),
      options: optionsSum.toString(),
      equipements: equipmentTotal.toString(),
      total: recurringBaseCost.toString()
    });

    const monthlyBase = quote.installation_one_time
      ? recurringBaseCost
      : recurringBaseCost.plus(installationPrice);

    const discountBase = monthlyBase;
    
    const discountPercentage = toDecimal(quote.discount_value).div(100);
    const discountAmount = discountBase.times(discountPercentage);
    const monthlyHT = discountBase.minus(discountAmount);

    const engagementDuration = toDecimal(quote.engagement_duration);
    const recurringTotal = monthlyHT.times(engagementDuration);

    const totalHT = quote.installation_one_time
      ? recurringTotal.plus(installationPrice)
      : recurringTotal;

    const taxRate = toDecimal(quote.tax_rate || TAX_RATE_DEFAULT).div(100);
    const monthlyTTC = monthlyHT.times(taxRate.plus(1));

    Object.assign(quote, {
      monthly_ht: parseFloat(monthlyHT.toFixed(2)),
      monthly_ttc: parseFloat(monthlyTTC.toFixed(2)),
      total_ht: parseFloat(totalHT.toFixed(2)),
      total_ttc: parseFloat(totalHT.times(taxRate.plus(1)).toFixed(2)),
      yearly_ht: parseFloat(monthlyHT.times(12).toFixed(2)),
      yearly_ttc: parseFloat(monthlyTTC.times(12).toFixed(2)),
      total_discount: parseFloat(discountAmount.times(engagementDuration).toFixed(2)),
      total_discount_ttc: parseFloat(discountAmount.times(engagementDuration).times(taxRate.plus(1)).toFixed(2))
    });

    logger.debug('Calculs finaux détaillés :', {
      baseRecurrente: monthlyBase.toString(),
      remiseMensuelle: discountAmount.toString(),
      mensuelHT: monthlyHT.toString(),
      totalHT: totalHT.toString(),
      installationUnique: quote.installation_one_time
    });

    await quote.save({ transaction });
    quote._recalculating = false;
    return quote;

  } catch (error) {
    if (quote) quote._recalculating = false;
    logger.error(`Erreur dans recalculateTotals : ${error.message}`);
    throw error;
  }
}

module.exports = {
  calculatePriceTTC,
  calculateTotals,
  calculateFormulaTotals,
  calculateSubTotal,
  calculateTotalWithDiscount,
  calculateEquipmentsTotal,
  recalculateTotals,
};
