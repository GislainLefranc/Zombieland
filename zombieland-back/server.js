import 'dotenv/config';
import './app/sequelize.js';
import './app/models.js';
import { createServer } from 'node:http';
import app from './app/app.js';

const PORT = process.env.PORT ?? 3000;

// Création et démarrage du serveur
const server = createServer(app);
server.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

export default server;
