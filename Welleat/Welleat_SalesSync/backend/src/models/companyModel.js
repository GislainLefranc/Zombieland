module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'Company',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]{5}$/,
            msg: 'Le code postal doit contenir 5 chiffres',
          },
        },
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      establishmentType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'client potentiel',
        validate: {
          isIn: {
            args: [['client potentiel', 'client', 'ambassadeur']],
            msg: "La valeur doit être 'client potentiel', 'client' ou 'ambassadeur'",
          },
        },
      },
      organizationType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Non spécifique',
        validate: {
          isIn: {
            args: [['Non spécifique', 'collectivité', 'intercommunalité', 'département', 'région']],
            msg: "La valeur de organizationType n'est pas autorisée",
          },
        },
      },
      numberOfCanteens: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      numberOfCentralKitchens: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'Companies',
      underscored: true,
      paranoid: false,
    }
  );
  return Company;
};
