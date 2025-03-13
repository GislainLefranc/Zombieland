// Dossier: config
// Fichier: swagger.js
// Configuration de Swagger pour la documentation de l'API

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Welleat API',
      version: '1.0.0',
      description: 'Documentation de l\'API Welleat',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api`,
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js', './src/docs/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Montage du middleware Swagger dans l'application Express.
 *
 * @param {object} app - Instance Express.
 */
function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
