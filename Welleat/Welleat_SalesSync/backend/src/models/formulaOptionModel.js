module.exports = (sequelize, DataTypes) => {
  const Formula_Options = sequelize.define(
    'Formula_Options',
    {
      formula_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'formula_id',
        references: { model: 'Formulas', key: 'id' },
      },
      option_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'option_id',
        references: { model: 'Options', key: 'id' },
      },
    },
    {
      tableName: 'Formula_Options',
      timestamps: true,
      underscored: true,
    }
  );
  return Formula_Options;
};
