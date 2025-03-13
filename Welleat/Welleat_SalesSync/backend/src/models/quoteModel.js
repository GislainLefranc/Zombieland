const logger = require('../utils/logger');

module.exports = (sequelize, DataTypes) => {
  const Quote = sequelize.define(
    'Quote',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Companies', key: 'id' },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'projet',
      },
      valid_until: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      engagement_duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      formula_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Formulas', key: 'id' },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      installation_included: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      installation_one_time: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      maintenance_included: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      hotline_included: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      tax_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 20.0,
      },
      discount_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      discount_value: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      discount_reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      calculated_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      installation_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      maintenance_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      hotline_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      rejection_reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      total_ht: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total_ttc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      monthly_ht: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      monthly_ttc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      yearly_ht: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      yearly_ttc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      total_discount_ttc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      formula_options: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      formula_customizations: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'Quotes',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async (quote, options) => {
          const transaction = options.transaction;
          try {
            logger.info('Création devis - données initiales:', {
              formula_id: quote.formula_id,
              equipments: quote.equipments,
            });
    
            let formula_total = 0;
            let installationPriceFromFormula = 0;
            if (quote.formula_id) {
              const Formula = sequelize.model('Formula');
              const formula = await Formula.findByPk(quote.formula_id, { transaction });
              if (formula) {
                if (quote.installation_included) {
                  quote.installation_price = formula.installation_price;
                  installationPriceFromFormula = parseFloat(formula.installation_price) || 0;
                }
                if (quote.maintenance_included) {
                  quote.maintenance_price = formula.maintenance_price;
                }
                if (quote.hotline_included) {
                  quote.hotline_price = formula.hotline_price;
                }
                const optionsSum = (formula.options || []).reduce(
                  (sum, opt) => sum + (parseFloat(opt.price_ht) || 0),
                  0
                );
                formula_total =
                  parseFloat(formula.installation_price) +
                  parseFloat(formula.maintenance_price) +
                  parseFloat(formula.hotline_price) +
                  optionsSum;
              }
            }
            logger.info('Total formule calculé:', formula_total);
    
            let equipment_total = 0;
            if (quote.equipments && Array.isArray(quote.equipments)) {
              for (const eq of quote.equipments) {
                logger.info('Traitement équipement:', eq);
                const quantity = Number(eq.quantity || 0);
                const price = Number(eq.unit_price_ht || 0);
                const effectiveQty = (eq.is_first_unit_free && quantity > 1) ? quantity - 1 : quantity;
                const equipTotal = price * effectiveQty;
                equipment_total += equipTotal;
              }
            }
            logger.info('Total équipements calculé:', equipment_total);
    
            const recurringFormulaCost =
              (quote.installation_one_time && formula_total)
                ? formula_total - installationPriceFromFormula
                : formula_total;
            const sub_total = recurringFormulaCost + equipment_total;
            const discount = (sub_total * Number(quote.discount_value || 0)) / 100;
            const total_ht = sub_total - discount;
            const tax_rate = Number(quote.tax_rate || 20);
            const total_ttc = total_ht * (1 + tax_rate / 100);
    
            Object.assign(quote, {
              calculated_price: recurringFormulaCost,
              equipment_total,
              sub_total,
              total_discount: discount,
              total_ht,
              total_ttc,
              monthly_ht: total_ht,
              monthly_ttc: total_ttc,
              yearly_ht: total_ht * 12,
              yearly_ttc: total_ttc * 12,
            });
    
            logger.info('Totaux finaux calculés:', {
              formula_total,
              equipment_total,
              recurringFormulaCost,
              sub_total,
              discount,
              total_ht,
              total_ttc,
            });
    
          } catch (error) {
            logger.error(`Erreur calcul totaux: ${error.stack}`);
            throw error;
          }
        },
      },
    }
  );
  return Quote;
};
