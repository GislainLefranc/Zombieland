// Dossier : src/config
// Fichier : passport.js
// Fichier de configuration de Passport.js pour l'authentification JWT.


const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/indexModels'); 

// Options pour la stratégie JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// Mise en place de la stratégie JWT pour Passport
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Recherche de l'utilisateur à partir de l'ID contenu dans le token
      const user = await User.findByPk(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
