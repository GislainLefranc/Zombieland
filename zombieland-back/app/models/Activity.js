// Import necessary classes and types from Sequelize
import { Model, DataTypes } from 'sequelize';
// Import the Sequelize connection instance
import client from '../sequelize.js';

// Declare and export the Activity class that extends Sequelize's Model
export default class Activity extends Model {}

// Initialize the Activity model with its attributes and options
Activity.init({
    // Define the 'id' attribute
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Define the 'title' attribute
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    // Define the 'description' attribute
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Define the 'category_id' attribute which is a foreign key
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category',
            key: 'id'
        }
    }  
}, {
    // Use the Sequelize connection instance
    sequelize: client,
    tableName: "activity",
    timestamps: true,
    underscored: true  // column name in snake case
});