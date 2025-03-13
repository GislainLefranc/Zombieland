module.exports = (sequelize, DataTypes) => {
  const InterlocutorCompany = sequelize.define(
    'InterlocutorCompany',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      interlocutor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Interlocutors', key: 'id' },
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Companies', key: 'id' },
      },
      isPrincipal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'Interlocutors_Companies',
      timestamps: true,
      underscored: true,
    }
  );
  return InterlocutorCompany;
};
