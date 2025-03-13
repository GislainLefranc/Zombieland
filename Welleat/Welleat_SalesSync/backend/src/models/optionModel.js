module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define(
    'Option',
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
      },
      price_ttc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      discount_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      discount_value: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Option_Categories', key: 'id' },
        onDelete: 'SET NULL',
      },
    },
    {
      tableName: 'Options',
      timestamps: true,
    }
  );
  return Option;
};
