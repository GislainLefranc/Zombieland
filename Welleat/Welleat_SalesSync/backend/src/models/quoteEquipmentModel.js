const { calculatePriceTTC } = require('../services/utils/Calculator');

module.exports = (sequelize, DataTypes) => {
  const QuoteEquipment = sequelize.define(
    'QuoteEquipment',
    {
      quote_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'quote_id',
        references: { model: 'Quotes', key: 'id' },
      },
      equipment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'equipment_id',
        references: { model: 'Equipments', key: 'id' },
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        field: 'quantity',
      },
      unit_price_ht: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        field: 'unit_price_ht',
      },
      unit_price_ttc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        field: 'unit_price_ttc',
      },
      is_first_unit_free: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_first_unit_free',
      },
    },
    {
      tableName: 'Quotes_Equipments',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeValidate: (qe) => {
          if (qe.unit_price_ht !== undefined) {
            qe.unit_price_ttc = calculatePriceTTC(qe.unit_price_ht);
          }
        },
      },
    }
  );
  return QuoteEquipment;
};
