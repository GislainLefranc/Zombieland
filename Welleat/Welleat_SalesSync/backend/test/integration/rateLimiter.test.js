const { sequelize } = require('../../src/config/sequelize'); // Importez votre instance Sequelize

describe('Rate Limiter Tests', () => {
  let mockRateLimit;
  let limiter;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.resetModules(); // Réinitialise le cache des modules

    // 1. Définir le mock avant d'importer 'rateLimiter'
    mockRateLimit = jest.fn((config) => {
      return (req, res, next) => {
        // Initialiser le compteur si ce n'est pas déjà fait
        mockRateLimit.requestCount = (mockRateLimit.requestCount || 0) + 1;

        if (mockRateLimit.requestCount > config.max) {
          return res.status(429).json({ error: config.message });
        }
        next();
      };
    });

    // 2. Mock 'express-rate-limit' avant d'importer 'rateLimiter'
    jest.mock('express-rate-limit', () => mockRateLimit);

    // 3. Importer le middleware après avoir mocké 'express-rate-limit'
    limiter = require('../../src/config/rateLimiter');

    // Initialiser les mocks pour req, res, next
    mockReq = {
      ip: '127.0.0.1',
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterAll(async () => {
    // Fermer la connexion Sequelize après tous les tests
    await sequelize.close();
  });

  describe('Configuration', () => {
    it('devrait être configuré avec les bonnes options', () => {
      // Vérifier que le rateLimit a été appelé avec les bonnes configurations
      expect(mockRateLimit).toHaveBeenCalledWith({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: 'Trop de requêtes créées depuis cette IP, veuillez réessayer plus tard.',
      });
    });
  });

  describe('Comportement', () => {
    it('devrait autoriser les requêtes sous la limite', () => {
      limiter(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('devrait bloquer les requêtes au-dessus de la limite', () => {
      // Simuler un dépassement de la limite
      mockRateLimit.requestCount = 101;

      limiter(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Trop de requêtes créées depuis cette IP, veuillez réessayer plus tard.',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});