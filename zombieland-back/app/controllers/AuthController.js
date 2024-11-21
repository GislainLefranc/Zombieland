// Import modules for authentication and security (Importer des modules pour l'authentification et la sécurité)
import bcrypt from 'bcrypt'; // Library for hashing passwords (Bibliothèque pour hacher les mots de passe)
import jwt from 'jsonwebtoken'; // Library for generating JSON Web Tokens (JWT) (Bibliothèque pour générer des tokens JWT)
import crypto from 'crypto'; // Node.js module for cryptographic operations (Module Node.js pour les opérations cryptographiques)
import { Op } from 'sequelize'; // Sequelize operator for advanced queries (Opérateur Sequelize pour les requêtes avancées)
import User from '../models/User.js'; // User model for database operations (Modèle utilisateur pour les opérations en base de données)
import { sendEmail } from '../services/emailService.js'; // Email service for sending emails (Service d'email pour envoyer des emails)

// Function to hash a password securely (Fonction pour hacher un mot de passe de manière sécurisée)
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10); // Use bcrypt with a salt round of 10 (Utilise bcrypt avec un sel de 10)
};

// User login function (Fonction de connexion de l'utilisateur)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email in the database (Trouver l'utilisateur par email dans la base de données)
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides' }); // Invalid credentials error
        }

        // Compare the provided password with the hashed password (Comparer le mot de passe fourni avec le mot de passe haché)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides' }); // Invalid credentials error
        }

        // Generate a JWT token with user details (Générer un token JWT avec les détails de l'utilisateur)
        const token = jwt.sign(
            { id: user.id, role: user.role_id }, // Payload includes user ID and role (Le payload inclut l'ID utilisateur et le rôle)
            process.env.JWT_SECRET, // Secret key from environment variables (Clé secrète depuis les variables d'environnement)
            { expiresIn: '1h' } // Token expires in 1 hour (Token expire dans 1 heure)
        );

        console.log(`Utilisateur connecté: ${email} (ID: ${user.id})`); // Log the successful login

        res.status(200).json({ token }); // Send the token to the client (Envoyer le token au client)
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ message: 'Erreur serveur' }); // Handle server error
    }
};

// Function to update a user's password securely (Fonction pour mettre à jour le mot de passe d'un utilisateur de manière sécurisée)
export const updatePassword = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { password } = req.body;

        // Find the user by ID (Rechercher l'utilisateur par son ID)
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' }); // User not found error
        }

        // Hash the new password (Hacher le nouveau mot de passe)
        const hashedPassword = await hashPassword(password);

        // Update the password in the database (Mettre à jour le mot de passe dans la base de données)
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès' }); // Success response
    } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du mot de passe' });
    }
};

// Function to generate a password reset token (Fonction pour générer un token de réinitialisation de mot de passe)
export const generateResetToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists (Vérifier si l'utilisateur existe)
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet email.' }); // User not found error
        }

        // Generate a secure reset token and expiry time (Générer un token de réinitialisation sécurisé et une durée d'expiration)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour (Valide pendant 1 heure)

        // Hash the token and save it to the database (Hacher le token et l'enregistrer dans la base de données)
        user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetTokenExpiry = new Date(resetTokenExpiry);
        await user.save();

        // Create the reset link (Créer le lien de réinitialisation)
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        // Send reset email to the user (Envoyer un email de réinitialisation à l'utilisateur)
        await sendEmail({
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            text: `Bonjour,\n\nCliquez sur ce lien pour réinitialiser votre mot de passe :\n\n${resetLink}\n\nCe lien est valable pendant 1 heure.`,
            html: `<p>Réinitialisez votre mot de passe en cliquant sur ce lien : <a href="${resetLink}">${resetLink}</a></p>`,
        });

        res.status(200).json({ message: 'Lien de réinitialisation envoyé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la génération du token de réinitialisation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Function to reset the user's password (Fonction pour réinitialiser le mot de passe de l'utilisateur)
export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Check if resetToken and newPassword are provided (Vérifier si resetToken et newPassword sont fournis)
        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: 'Token ou nouveau mot de passe manquant.' });
        }

        // Hash the provided reset token (Hacher le token fourni)
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find the user with the reset token (Rechercher l'utilisateur avec le token de réinitialisation)
        const user = await User.findOne({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: { [Op.gt]: new Date() }, // Check if token is still valid (Vérifier si le token est valide)
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token invalide ou expiré.' }); // Invalid or expired token
        }

        // Hash the new password and save it (Hacher le nouveau mot de passe et l'enregistrer)
        user.password = await hashPassword(newPassword);
        user.resetToken = null; // Clear reset token (Supprimer le token de réinitialisation)
        user.resetTokenExpiry = null; // Clear token expiry (Supprimer la date d'expiration)

        await user.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' }); // Success response
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
