import passport from 'passport';

// JWT authentication middleware (Middleware d'authentification JWT)
const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      // Handle server errors during authentication (Gérer les erreurs de serveur lors de l'authentification)
      return res.status(500).json({ message: 'Server error during authentication' }); // (Erreur de serveur lors de l'authentification)
    }
    if (!user) {
      // Handle unauthorized access when no valid user is found (Gérer les accès non autorisés si aucun utilisateur valide n'est trouvé)
      return res.status(401).json({ message: 'Unauthorized access' }); // (Accès non autorisé)
    }

    req.user = user; // Attach the authenticated user to the request object (Attacher l'utilisateur authentifié à l'objet requête)
    return next(); // Proceed to the next middleware or route handler (Passer au middleware ou gestionnaire de route suivant)
  })(req, res, next); // Call the Passport authenticate method (Appeler la méthode d'authentification de Passport)
};

export default authenticateJWT;
