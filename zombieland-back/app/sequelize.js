// Importation des variables d'environnement
import 'dotenv/config';
import { Sequelize } from 'sequelize';

// Configuration de Sequelize avec SSL pour Supabase
const client = new Sequelize(process.env.PG_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
  logging: false,
});

// Fonction de synchronisation des tables
async function syncDatabase() {
  try {
    await client.authenticate();
    console.log(`🧟 Database connected`);

    await client.sync({ alter: true });
    console.log('🛠️ Tables synchronized successfully');
  } catch (error) {
    console.error(`❌ Error synchronizing tables: ${error.message}`);
  }
}

syncDatabase();

export default client; // Export de l'instance Sequelize
