module.exports = (sequelize, DataTypes) => {
  const Simulation = sequelize.define(
    'Simulation',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: { model: 'Users', key: 'id' },
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'company_id',
        references: { model: 'Companies', key: 'id' },
      },
      costPerDish: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'cost_per_dish',
        defaultValue: 2.8,
      },
      dishesPerDay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'dishes_per_day',
        defaultValue: 1000,
      },
      wastePercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'waste_percentage',
        defaultValue: 24,
      },
      dailyProductionSavings: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'daily_production_savings',
      },
      monthlyProductionSavings: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'monthly_production_savings',
      },
      dailyWasteSavings: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'daily_waste_savings',
      },
      monthlyWasteSavings: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'monthly_waste_savings',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'projet',
        validate: {
          isIn: [['projet', 'en attente', 'approuvé', 'rejeté']],
        },
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by',
        references: { model: 'Users', key: 'id' },
      },
    },
    {
      tableName: 'Simulations',
      timestamps: true,
      underscored: true,
    }
  );
  return Simulation;
};
