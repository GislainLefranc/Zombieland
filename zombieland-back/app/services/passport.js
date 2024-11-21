// services/passport.js

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '../models/User.js';

// Options JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrait le token de l'en-tête
  secretOrKey: process.env.JWT_SECRET, // Clé secrète
  algorithms: ['HS256'], // Algorithme de signature
};

// Stratégie JWT
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id);
      if (user) {
        // Inclure le rôle dans l'objet user
        const userWithRole = { ...user.toJSON(), role: jwt_payload.role };
        return done(null, userWithRole);
      }
      return done(null, false); // Utilisateur non trouvé
    } catch (err) {
      return done(err, false); // Gestion des erreurs
    }
  })
);

export default passport;
