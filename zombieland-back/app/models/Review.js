// Import necessary classes and types from Sequelize
import { Model, DataTypes } from 'sequelize';
// Import the Sequelize connection instance
import client from '../sequelize.js';

// Declare and export the Review class that extends Sequelize's Model
export default class Review extends Model {}

// Initialize the Review model with its attributes and options
Review.init({
    // Define the ID of the review
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // is a primary key
        autoIncrement: true
    },
    // Define the rate of the review (can only be rated out of 5)
    note: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        },
        allowNull: false // cannot be null
    },
    // Define the content of the review comment
    comment: {
        type: DataTypes.TEXT,
        allowNull: true // can be null; you must rate the activity or stay, but you're not forced to write a comment
    },
    // Define the activity ID to link reviews to activities
    activity_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // A review must always be linked to an activity
        references: {
            model: 'activity', // Assuming you have an `activity` table
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
