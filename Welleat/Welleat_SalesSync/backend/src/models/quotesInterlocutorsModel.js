module.exports = (sequelize, DataTypes) => {
  const QuotesInterlocutors = sequelize.define(
    'QuotesInterlocutors',
    {
      quote_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'Quotes', key: 'id' },
      },
      interlocutor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'Interlocutors', key: 'id' },
      },
      is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'Quotes_Interlocutors',
      timestamps: true,
      underscored: true,
    }
  );
  return QuotesInterlocutors;
};
