// Import necessary classes and types from Sequelize
import { Model, DataTypes } from 'sequelize';
// Import the Sequelize connection instance
import client from '../sequelize.js';

// Declare and export the Reservation class that extends Sequelize's Model
export default class Reservation extends Model {};

// Initialize the Reservation model with its attributes and options
Reservation.init({
    //Define the id of the reservation
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    //Define the begining date of the reservation
    date_start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    //Define the end date of the reservation
    date_end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    //Define the number of tickets took in the reservation
    number_tickets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //Define the id of the user that made the reservation
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    //Define the id of the period of the reservation
    period_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'period',
            key: 'id'
        }
    }
}, {
    // Use the Sequelize connection instance
    sequelize: client,
    tableName: "reservation",
    timestamps: true,
    underscored: true  // Utilise des noms de colonnes en snake_case
});