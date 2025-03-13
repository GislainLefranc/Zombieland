module.exports = (sequelize, DataTypes) => {
  const Functioning = sequelize.define(
    'Functioning',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      typeOfFunctioning: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['autonome', 'en régie centrale', 'délégation']],
        },
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Companies', key: 'id' },
      },
    },
    {
      tableName: 'Functionings',
      timestamps: true,
    }
  );
  return Functioning;
};
