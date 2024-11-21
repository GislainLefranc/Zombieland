// Import necessary classes and types from Sequelize
import { Model, DataTypes } from "sequelize";
// Import the Sequelize connection instance
import client from '../sequelize.js';

// Declare and export the Payment class that extends Sequelize's Model
export default class Payment extends Model {}

// Initialize the Payment model with its attributes and options
Payment.init({
    //define the id of the payment
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    //Define the amount of the payment
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false //cannot be null
    },
    //Declared the status of the payment
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false, //cannot be null
        defaultValue: 'pending' //is pending by default
    },
    //Define the date of the amout
    date_amount: {
        type: DataTypes.DATE,
        allowNull: false, //cannot be null
        defaultValue: DataTypes.NOW // is setup to now by default
    },
    //Define the id of the reservation that is linked to this payment
    reservation_id: {
        type: DataTypes.INTEGER,
        allowNull: false, //cannot be null
        references: {
            model: 'reservation',
            key: 'id'
        },
    },
    //Define the stripe id of the payment
    stripe_payment_id: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    }
}, {
    // Use the Sequelize connection instance
    sequelize: client,
    tableName: "payment",
    timestamps: true,
    underscored: true
});