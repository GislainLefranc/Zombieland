// Dossier: src/config
// Fichier: sequelize.js
// Configuration de la connexion à la base de données avec Sequelize

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();
const env = process.env.NODE_ENV || 'development';

// Configuration de la base de données selon l'environnement
const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    dialectOptions: { ssl: false },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    define: { timestamps: true, underscored: true, freezeTableName: true },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: { ssl: false },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    define: { timestamps: true, underscored: true, freezeTableName: true },
  },
};

const envConfig = config[env];

// Création de l'instance Sequelize avec la configuration adaptée
const sequelize = new Sequelize(
  envConfig.database,
  envConfig.username,
  envConfig.password,
  {
    host: envConfig.host,
    port: envConfig.port,
    dialect: envConfig.dialect,
    logging: envConfig.logging,
    dialectOptions: envConfig.dialectOptions,
    pool: envConfig.pool,
    define: envConfig.define,
  }
);

/**
 * Vérifier la connexion à la base de données.
 */
async function initSync() {
  try {
    await sequelize.authenticate();
    logger.info(`Connexion à la base de données '${envConfig.database}' établie en mode ${env}.`);
  } catch (error) {
    logger.error("Erreur lors de l'authentification de la base de données :", error);
    throw error;
  }
}

module.exports = { sequelize, initSync };
