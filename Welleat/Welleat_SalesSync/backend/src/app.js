// Dossier : src/validators
// Fichier : userValidator.js
// Validation des données d'un utilisateur.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/indexRoutes');
const setupSwagger = require('./config/swagger');
require('./config/passport');
const protectedRoute = require('./routes/protectedRoute');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');

const app = express();

// Middleware de log pour les requêtes entrantes
app.use(requestLogger);

// Configuration CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://welleat-salessync.surge.sh'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

// Routes API
app.use('/api', routes);
app.use('/api', protectedRoute);

// Documentation Swagger
setupSwagger(app);

// Gestion des erreurs 404
app.use((req, res) => {
  console.log('❌ Route non trouvée:', req.method, req.url);
  res.status(404).json({ error: "Endpoint non trouvé. Veuillez vérifier l'URL." });
});

// Gestion globale des erreurs
app.use(errorHandler);

module.exports = app;
