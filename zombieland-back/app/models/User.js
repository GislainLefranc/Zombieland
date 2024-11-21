import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import client from '../sequelize.js';

export default class User extends Model { }

// Initialisation du modèle User avec hachage automatique
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    street_address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    postal_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'role',
            key: 'id'
        }
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null 
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null 
    }
}, {
    sequelize: client,
    tableName: "user",
    timestamps: true,
    underscored: true
});
