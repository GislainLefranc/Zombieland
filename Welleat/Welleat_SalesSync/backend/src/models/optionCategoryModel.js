module.exports = (sequelize, DataTypes) => {
  const OptionCategory = sequelize.define(
    'OptionCategory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'Option_Categories',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return OptionCategory;
};
