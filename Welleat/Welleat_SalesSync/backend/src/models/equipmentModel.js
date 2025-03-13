module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define(
    'Equipment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'name',
      },
      description: {
        type: DataTypes.TEXT,
        field: 'description',
      },
      free_equipment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'free_equipment',
      },
      price_ttc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'price_ttc',
      },
      price_ht: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'price_ht',
      },
      notes: {
        type: DataTypes.TEXT,
        field: 'notes',
      },
      discount_type: {
        type: DataTypes.STRING(20),
        field: 'discount_type',
      },
      discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'discount_value',
      },
      discount_reason: {
        type: DataTypes.STRING(255),
        field: 'discount_reason',
      },
      formula_compatible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'formula_compatible',
      },
      formula_discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        field: 'formula_discount',
      },
      image: {
        type: DataTypes.STRING(255),
        field: 'image',
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'category_id',
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_default',
      },
    },
    {
      tableName: 'Equipments',
      timestamps: true,
      underscored: true,
    }
  );
  return Equipment;
};
