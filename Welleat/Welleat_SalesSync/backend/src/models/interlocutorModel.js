module.exports = (sequelize, DataTypes) => {
  const Interlocutor = sequelize.define(
    'Interlocutor',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Le nom de famille est requis' },
          len: { args: [2, 50], msg: '2 à 50 caractères requis pour le nom' },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Le prénom est requis' },
          len: { args: [2, 50], msg: '2 à 50 caractères requis pour le prénom' },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: 'Email invalide' },
          notEmpty: { msg: "L'email est requis" },
          len: { args: [5, 100], msg: '5 à 100 caractères requis pour l’email' },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/i,
            msg: 'Numéro de téléphone invalide',
          },
        },
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isLengthOk(value) {
            if (value && (value.length < 2 || value.length > 100)) {
              throw new Error('Le poste doit avoir 2 à 100 caractères');
            }
          },
        },
      },
      interlocutorType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'client potentiel',
        validate: {
          isIn: {
            args: [['client potentiel', 'partenaire', 'fournisseur']],
            msg: "Type d'interlocuteur invalide",
          },
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isPrincipal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isIndependent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      primaryCompanyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Companies', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    },
    {
      tableName: 'Interlocutors',
      timestamps: true,
      underscored: true,
      paranoid: false,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'email'],
          name: 'unique_user_email',
        },
        {
          fields: ['email', 'primary_company_id'],
          name: 'idx_email_primaryCompanyId',
        },
        {
          fields: ['email'],
          name: 'idx_interlocutors_email',
        },
      ],
    }
  );
  return Interlocutor;
};
