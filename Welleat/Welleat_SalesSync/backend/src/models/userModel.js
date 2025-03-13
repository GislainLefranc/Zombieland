module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: { msg: 'Email invalide' } },
        field: 'email',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password',
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'phone',
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'position',
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Roles', key: 'id' },
        field: 'role_id',
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'reset_password_token',
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'reset_password_expires',
      },
    },
    {
      tableName: 'Users',
      timestamps: true,
      underscored: true,
      paranoid: false,
    }
  );
  return User;
};
