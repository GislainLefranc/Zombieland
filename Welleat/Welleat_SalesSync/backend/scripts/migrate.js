const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const dotenv = require('dotenv');
const logger = require('../src/utils/logger');

dotenv.config();

async function runMigration() {
  try {
    // 1. (Optionnel) Création de la base de données si besoin (fonction désactivée ici)
    /*
    await createDatabaseIfNotExists();
    */

    // 2. Exécution des fichiers de migration dans l'ordre
    const migrationsDir = path.resolve(__dirname, '../database/migrations');
    let migrations = await fs.readdir(migrationsDir);
    // Tri alphabétique pour exécuter dans l'ordre voulu (ex: "000001_init.sql", "000002_add_triggers.sql", ...)
    migrations = migrations.sort();
    for (const migration of migrations) {
      console.log(`Exécution de la migration: ${migration}`);
      const migrationPath = path.join('../database/migrations', migration);
      await execSQL(migrationPath);
      console.log(`Migration ${migration} terminée.`);
    }

    // 3. Exécuter le seeding si nécessaire (ici uniquement en environnement development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Exécution du seeding...');
      await execSQL('../database/seeding_database.sql');
      logger.info('✅ Seeding terminé.');
    }

    console.log('✅ Migrations terminées avec succès');
  } catch (error) {
    console.error('❌ Erreur durant les migrations:', error);
    process.exit(1);
  }
}

function execSQL(filePath) {
  return new Promise((resolve, reject) => {
    // Obtenir le chemin absolu du fichier SQL
    const fullPath = path.resolve(__dirname, filePath);
    const command = `psql -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f "${fullPath}"`;
    const env = { ...process.env, PGPASSWORD: process.env.DB_PASSWORD };
    exec(command, { env }, (error, stdout, stderr) => {
      if (error) {
        // Affiche stderr ou stdout en cas d'erreur
        reject(new Error(stderr || stdout));
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

runMigration();
