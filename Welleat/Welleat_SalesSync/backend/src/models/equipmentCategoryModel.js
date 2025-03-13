module.exports = (sequelize, DataTypes) => {
  const EquipmentCategory = sequelize.define(
    'EquipmentCategory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description',
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_default',
      },
    },
    {
      tableName: 'Equipment_Categories',
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  );
  return EquipmentCategory;
};
