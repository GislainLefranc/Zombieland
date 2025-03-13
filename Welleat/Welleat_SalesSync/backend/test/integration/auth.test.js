/************************************************************
 *  Folder: test/integration
 *  File: auth.test.js
 ************************************************************/
const request = require('supertest');
const app = require('../../src/app.js');
const { sequelize, User, Role } = require('../../src/models/indexModels.js');
const bcrypt = require('bcrypt');

let expiredToken;

describe('Auth Endpoints (Endpoints d\'auth)', () => {
  beforeAll(async () => {
    // Sync DB (Synchroniser la base de données)
    await sequelize.sync({ force: true });

    // Create roles (Créer les rôles)
    await Role.bulkCreate([
      { id: 1, name: 'admin', description: 'Administrateur avec tous les privilèges' },
      { id: 2, name: 'sales_user', description: 'Utilisateur des ventes avec privilèges limités' },
    ]);

    // Create admin user (Créer un utilisateur admin)
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    await User.create({
      id: 1,
      lastName: 'Admin',
      firstName: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: '0612345678',
      position: 'Administrateur',
      roleId: 1,
    });

    // Example expired token (Exemple de token expiré)
    expiredToken = 'expired.token.here';
  });

  afterAll(async () => {
    // Close DB connection (Fermer la connexion)
    await sequelize.close();
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user and return a token (doit connecter et renvoyer un token)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'adminpassword',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password (ne doit pas connecter avec un mot de passe faux)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Email ou mot de passe incorrect');
    });

    it('should not login non-existing user (ne doit pas connecter un user inexistant)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'somepassword',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Email ou mot de passe incorrect');
    });

  });
});
