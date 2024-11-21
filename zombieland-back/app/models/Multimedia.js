// Import necessary classes and types from Sequelize
import { Model, DataTypes } from 'sequelize';
// Import the Sequelize connection instance
import client from '../sequelize.js';

// Declare and export the Multimedia class that extends Sequelize's Model
export default class Multimedia extends Model {}

// Initialize the Multimedia model with its attributes and options
Multimedia.init({
  //Define the id of the multimedia
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, //is a primary key
      autoIncrement: true, //is auto incremented
    },
    //Define the name of the multimedia
    name: {
      type: DataTypes.TEXT,
      allowNull: false, //cannot be null
    },
    //Define the url of the multimedia
    url: {
      type: DataTypes.TEXT,
      allowNull: false, //cannot be null
    }
  }, {
    // Use the Sequelize connection instance
    sequelize: client,
    tableName: 'multimedia',
    timestamps: true,
    underscored: true  // column name in snake case
  });