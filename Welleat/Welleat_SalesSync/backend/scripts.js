const { sequelize } = require('../src/config/sequelize');
const fs = require('fs');
const path = require('path');
const logger = require('../src/utils/logger');

async function resetDatabase() {
  try {
    // Lecture du fichier SQL
    const sqlFile = path.join(__dirname, '../database/seeding_database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Exécution du script SQL
    await sequelize.query(sql);
    
    logger.info('✅ Base de données réinitialisée avec succès');
  } catch (error) {
    logger.error(`❌ Erreur lors de la réinitialisation: ${error.message}`);
    throw error;
  }
}

// Exécution du script
if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = resetDatabase;