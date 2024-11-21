// Import necessary classes and types from Sequelize
import client from '../sequelize.js';
// Import the Sequelize connection instance
import { Model, DataTypes } from 'sequelize';

// Declare and export the Category class that extends Sequelize's Model
export default class Category extends Model {}

// Initialize the Category model with its attributes and options
Category.init({
    //Define the id of the category
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, //is a primarykey
        autoIncrement: true //is incremented by itself
    },
    //Define the name of the category
    name: {
        type: DataTypes.STRING,
        allowNull: false, //a category must have a name
        unique: true  // Assure that a category name is unique
    }
}, {
    // Use the Sequelize connection instance
    sequelize: client, 
    tableName: "category",
    timestamps: true,  // manages automatically the created_at and updated_at
    underscored: true  // column name in snake case
});