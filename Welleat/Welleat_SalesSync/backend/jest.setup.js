const { sequelize, defineEnums } = require('./src/config/sequelize');
const { Role, User } = require('./src/models/indexModels');
const bcrypt = require('bcrypt');

beforeAll(async () => {
  try {
    // Forcer la réinitialisation de la base de test
    await sequelize.sync({ force: true });
    await defineEnums();

    // Créer les rôles de base
    await Role.bulkCreate([
      { id: 1, name: 'admin', description: 'Administrateur' },
      { id: 2, name: 'sales_user', description: 'Utilisateur des ventes' }
    ]);

    // Créer un utilisateur admin de test
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await User.create({
      lastName: 'Test',
      firstName: 'Admin',
      email: 'test.admin@example.com',
      password: hashedPassword,
      roleId: 1
    });

  } catch (error) {
    console.error('❌ Erreur lors de la configuration de la base de test:', error);
    throw error;
  }
});

afterAll(async () => {
  await sequelize.close();
});