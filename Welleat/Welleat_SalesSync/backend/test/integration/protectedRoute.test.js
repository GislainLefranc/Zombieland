// test/integration/protectedRoute.test.js

const request = require('supertest');
const express = require('express');
const rateLimiter = require('../../src/config/rateLimiter');
const authMiddleware = require('../../src/middlewares/auth'); // Chemin corrigé
const protectedRoute = require('../../src/routes/protectedRoute');

const app = express();
app.use(express.json());
app.use(rateLimiter);
app.use('/api/secret-data', authMiddleware, protectedRoute);

describe('Protected Route (Route protégée)', () => {
  it('doit refuser l\'accès sans token', async () => {
    const res = await request(app)
      .get('/api/secret-data')
      .send();

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Token manquant ou format invalide');
  });

  it('doit autoriser avec un token valide', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 1, roleId: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get('/api/secret-data')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Accès autorisé à la route protégée');
  });
});