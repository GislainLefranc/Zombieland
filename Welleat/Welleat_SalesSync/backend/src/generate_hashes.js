// app/generate_hashes.js

const bcrypt = require('bcrypt');
const logger = require('../src/utils/logger');

async function generateHashes() {
  try {
    const password1 = await bcrypt.hash('password1', 10);
    const password2 = await bcrypt.hash('password2', 10);
    const password3 = await bcrypt.hash('password3', 10);

    logger.info(`Password 1 Hash: ${password1}`);
    logger.info(`Password 2 Hash: ${password2}`);
    logger.info(`Password 3 Hash: ${password3}`);
  } catch (error) {
    logger.error(`❌ Erreur lors de la génération des hashes: ${error.message}`, { stack: error.stack });
  }
}

generateHashes();
