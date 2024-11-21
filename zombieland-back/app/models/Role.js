// Import necessary classes and types from Sequelize
import { Model, DataTypes } from 'sequelize';
// Import the Sequelize connection instance
import client from '../sequelize.js';

// Declare and export the Role class that extends Sequelize's Model
export default class Role extends Model {};

// Initialize the Role model with its attributes and options
Role.init({
    //Define the id of the role
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    //Define the name of the role
    name: {
        type: DataTypes.STRING,  
        allowNull: false,
        unique: true  // Assure the name of the role is unique
    }
}, {
    // Use the Sequelize connection instance
    sequelize: client,
    tableName: "role",
    timestamps: true,
    underscored: true  // Utilise des noms de colonnes en snake_case (created_at, updated_at)
});