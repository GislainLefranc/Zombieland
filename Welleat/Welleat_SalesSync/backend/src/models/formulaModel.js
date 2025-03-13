const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Formula extends Model {}
  Formula.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price_ht: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      installation_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      maintenance_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      hotline_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
    },
    {
      sequelize,
      modelName: 'Formula',
      tableName: 'Formulas',
      timestamps: true,
      underscored: true,
    }
  );
  return Formula;
};
