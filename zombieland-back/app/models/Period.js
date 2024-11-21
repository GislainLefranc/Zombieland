// Import necessary classes and types from Sequelize
import { Model, DataTypes } from 'sequelize';
// Import the Sequelize connection instance
import client from '../sequelize.js';

// Declare and export the Period class that extends Sequelize's Model
export default class Period extends Model {}

// Initialize the Period model with its attributes and options
Period.init({
    //Define the id of the period
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, //is a primary key
        autoIncrement: true
    },
    //Define the name of the period
    name: {
        type: DataTypes.STRING,
        allowNull: false //cannot be null a period must have a name
    },
    //Define the begining date of the period
    date_start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    //Define the end date of the period
    date_end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    //Define the price of the period
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    // Use the Sequelize connection instance
    sequelize: client, 
    tableName: "period",
    timestamps: true,
    underscored: true  // Utilise des noms de colonnes en snake_case (created_at, updated_at)
});