module.exports = (sequelize, DataTypes) => {
  const UserInterlocutor = sequelize.define(
    'Users_Interlocutors',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      interlocutor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Interlocutors', key: 'id' },
      },
      is_principal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'Users_Interlocutors',
      timestamps: true,
      underscored: true,
    }
  );
  return UserInterlocutor;
};
