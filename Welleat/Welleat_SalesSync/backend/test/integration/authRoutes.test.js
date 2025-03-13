const request = require('supertest');
const express = require('express');
const { login } = require('../controllers/authController');
const authRoutes = require('./authRoutes');
const { User } = require('../models/indexModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// src/routes/authRoutes.test.js


// Mock dependencies
jest.mock('../controllers/authController');
jest.mock('../models/indexModels');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/auth', authRoutes);
    });

    describe('POST /auth/login', () => {
        const validCredentials = {
            email: 'test@example.com',
            password: 'password123'
        };

        it('should return 200 and JWT token for valid credentials', async () => {
            // Setup mocks
            const mockToken = 'mock.jwt.token';
            login.mockImplementation((req, res) => {
                res.json({ token: mockToken });
            });

            // Test request
            const response = await request(app)
                .post('/auth/login')
                .send(validCredentials)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('token');
            expect(response.body.token).toBe(mockToken);
            expect(login).toHaveBeenCalled();
        });

        it('should return 400 for invalid request body', async () => {
            const invalidCredentials = {
                email: 'invalid-email',
                password: ''
            };

            login.mockImplementation((req, res) => {
                res.status(400).json({ errors: ['Invalid email format', 'Password is required'] });
            });

            const response = await request(app)
                .post('/auth/login')
                .send(invalidCredentials)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
        });

        it('should return 401 for incorrect credentials', async () => {
            login.mockImplementation((req, res) => {
                res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            });

            const response = await request(app)
                .post('/auth/login')
                .send(validCredentials)
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Email ou mot de passe incorrect');
        });

        it('should return 500 for server errors', async () => {
            login.mockImplementation((req, res) => {
                res.status(500).json({ error: 'Erreur lors de la connexion' });
            });

            const response = await request(app)
                .post('/auth/login')
                .send(validCredentials)
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Erreur lors de la connexion');
        });
    });
});