import express from 'express';
import { router as indexRouter } from './routers/indexRouter.js';
import passport from './services/passport.js';
import cors from 'cors';

const app = express();

// Middleware pour analyser le JSON des requêtes
app.use(express.json({ limit: '50mb' }));

app.use(passport.initialize());

// Middleware pour autoriser les requêtes CORS provenant du front-end (port 5173)
app.use(cors({
    origin: process.env.CORS === '*' ? '*' : process.env.CORS.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true // Ce paramètre peut rester même si on utilise pas encore les cookies
}));

// Utilisation du routeur principal
app.use('/', indexRouter);

// Middleware global pour gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).json({ message: 'Erreur serveur' });
});

export default app;
