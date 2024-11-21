const authorizeRoles = (...allowedRoleIds) => {
  return (req, res, next) => {
    // Vérifie si l'utilisateur est connecté
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Vérifie si l'utilisateur a un rôle autorisé
    if (!allowedRoleIds.includes(req.user.role_id)) {
      return res.status(403).json({ message: "Accès refusé : rôle insuffisant" });
    }

    // Autorise si l'utilisateur est administrateur
    if (req.user.role_id === 3) {
      return next(); // Administrateur, accès autorisé
    }

    // Vérifie si l'utilisateur tente d'accéder à ses propres données (si applicable)
    if (Number(req.params.id) && req.user.role_id && req.user.id !== Number(req.params.id)) {
      return res.status(403).json({ message: "Accès interdit : Vous ne pouvez accéder qu'à vos propres données" });
    }

    next(); 
  };
};

export default authorizeRoles;
