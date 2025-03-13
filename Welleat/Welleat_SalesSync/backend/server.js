// backend/server.js
const app = require('./src/app');
const { sequelize, syncModels, verifyAssociations } = require('./src/utils/syncModels');
const dotenv = require('dotenv');
const logger = require('./src/utils/logger');
const fs = require('fs');
const path = require('path');

// Charge le fichier d'environnement approprié (.env ou .env.test)
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

// Détermine le port (5000 par défaut)
const PORT = process.env.PORT || 5000;

const initializeDatabase = async () => {
  try {
    const sqlFile = path.join(__dirname, 'database', 'seeding_database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    await sequelize.query(sql);
    logger.info('✅ Base de données initialisée (seeding exécuté)');
  } catch (error) {
    logger.error(`❌ Erreur d'initialisation: ${error.message}`);
    throw error;
  }
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('🔌 Connexion établie');
    verifyAssociations();
    await syncModels();
    if (process.env.NODE_ENV === 'development') {
      await initializeDatabase();
    }
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    logger.error(`❌ Erreur de démarrage: ${error.message}`);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, startServer };
