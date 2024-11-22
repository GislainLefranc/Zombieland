// Import necessary classes and types from Sequelize
import { Model, DataTypes } from 'sequelize';
// Import the Sequelize connection instance
import client from '../sequelize.js';

// Declare and export the Review class that extends Sequelize's Model
export default class Review extends Model {}

// Initialize the Review model with its attributes and options
Review.init({
    //Define the id of the review
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, //is a primary key
        autoIncrement: true
    },
    //Define the rate of the review can only be rated out of 5
    note: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        },
        allowNull: false //cannot be null
    },
    //Define the content the review comment
    comment: {
        type: DataTypes.TEXT,
        allowNull: true //can be null yoou must rate the activity or the stay but you're not forced to write a comment on it
    },
    //Define the reservation id because the fact that you can put a review is liked to the fact that you have a reservation (you cannot write a review if you've never been to the park)
    reservation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  // Assure that the review is linked to only one reservation
        references: {
            model: 'reservation',
            key: 'id'
        }
    }
}, {
    // Use the Sequelize connection instance
    sequelize: client,
    tableName: 'review',
    timestamps: true,
    underscored: true
});