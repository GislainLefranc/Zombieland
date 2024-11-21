// Importing necessary libraries and services
import { body, validationResult } from 'express-validator'; // For validating incoming data (Pour valider les données entrantes)
import { hashPassword } from './AuthController.js'; // Password hashing function (Fonction pour hacher les mots de passe)
import * as AuthController from './AuthController.js'; // All functions from AuthController (Toutes les fonctions d'AuthController)
import User from '../models/User.js'; // User model for database interaction (Modèle User pour interagir avec la base de données)
import { uploadImage, deleteImage } from '../services/uploadImage.js'; // Image management (Gestion des images)
import cloudinary from 'cloudinary'; // For Cloudinary API interaction (Pour interagir avec l'API Cloudinary)

// Create a new user (Créer un nouvel utilisateur)
export const createUser = [
    // Validate incoming data (Valider les données entrantes)
    body('email').isEmail().withMessage('Email invalide'), // Ensure valid email format (Vérifier le format de l'email)
    body('password') // Ensure password meets criteria (Vérifier les critères du mot de passe)
        .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
        .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
        .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
        .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
        .matches(/[@$!%*?&]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)'),
    body('firstname').notEmpty().withMessage('Le prénom est requis'), // Validate first name (Valider le prénom)
    body('lastname').notEmpty().withMessage('Le nom de famille est requis'), // Validate last name (Valider le nom de famille)

    // Handle user creation (Gérer la création de l'utilisateur)
    async (req, res) => {
        try {
            const errors = validationResult(req); // Collect validation errors (Récupérer les erreurs de validation)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() }); // Return validation errors (Retourner les erreurs)
            }

            const {
                email, password, firstname, lastname, birthday, phone_number,
                street_address, postal_code, city, role_id
            } = req.body;

            // Check if the email is already in use (Vérifier si l'email est déjà utilisé)
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).end(); // Email already exists (Email déjà existant)
            }

            // Hash the password using hashPassword function (Hacher le mot de passe)
            const hashedPassword = await hashPassword(password);

            // Create a new user in the database (Créer un utilisateur dans la base de données)
            const user = await User.create({
                email,
                password: hashedPassword,
                firstname,
                lastname,
                birthday: birthday || null,
                phone_number: phone_number || 'non renseigné',
                street_address: street_address || 'non renseigné',
                postal_code: postal_code || '00000',
                city: city || 'non renseigné',
                role_id: role_id || 2,
            });

            return res.status(201).json(user); // Return created user (Retourner l'utilisateur créé)
        } catch (error) {
            console.error("Error creating user:", error); // Log errors (Journaliser les erreurs)
            return res.status(500).end(); // Internal server error (Erreur serveur interne)
        }
    }
];

// Get all users (Obtenir tous les utilisateurs)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Exclude sensitive information (Exclure les informations sensibles)
        });
        if (!users.length) {
            return res.status(404); // No users found (Aucun utilisateur trouvé)
        }
        return res.status(200).json(users); // Return list of users (Retourner la liste des utilisateurs)
    } catch (error) {
        console.error('Error retrieving users:', error); // Log errors (Journaliser les erreurs)
        return res.status(500).end(); // Internal server error (Erreur serveur interne)
    }
};

// Get a specific user by ID (Obtenir un utilisateur spécifique par ID)
export const getOneUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        // Validate userId (Valider l'ID utilisateur)
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' }); // Invalid ID (ID invalide)
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // User not found (Utilisateur non trouvé)
        }
        return res.status(200).json(user); // Return user (Retourner l'utilisateur)
    } catch (error) {
        console.error('Error retrieving user:', error); // Log errors (Journaliser les erreurs)
        return res.status(500).json({ message: 'Server error' }); // Internal server error (Erreur serveur interne)
    }
};

// Update a user (Mettre à jour un utilisateur)
export const updateUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { firstname, lastname, email, phone_number, birthday, street_address, postal_code, city, image } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).end(); // User not found (Utilisateur non trouvé)
        }

        const updateData = { firstname, lastname, email, phone_number, birthday, street_address, postal_code, city };

        // Handle image updates (Gérer les mises à jour des images)
        if (image) {
            if (user.image) {
                await deleteImage(user.image); // Delete existing image (Supprimer l'image existante)
            }
            const imageUrl = await uploadImage(image, 'users'); // Upload new image (Télécharger la nouvelle image)
            updateData.image = imageUrl;
        }

        await user.update(updateData); // Update user data (Mettre à jour les données utilisateur)
        return res.status(200).json(user); // Return updated user (Retourner l'utilisateur mis à jour)
    } catch (error) {
        console.error('Error updating user:', error); // Log errors (Journaliser les erreurs)
        return res.status(500).end(); // Internal server error (Erreur serveur interne)
    }
};

// Delete a user (Supprimer un utilisateur)
export const deleteUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).end(); // User not found (Utilisateur non trouvé)
        }

        // Delete associated image from Cloudinary (Supprimer l'image associée de Cloudinary)
        if (user.image) {
            const publicId = user.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`avatars/${publicId}`);
        }

        await user.destroy(); // Delete user from database (Supprimer l'utilisateur de la base de données)
        return res.status(204).end(); // Return success with no content (Retourner le succès sans contenu)
    } catch (error) {
        console.error('Error deleting user:', error); // Log errors (Journaliser les erreurs)
        return res.status(500).end(); // Internal server error (Erreur serveur interne)
    }
};
// Get the currently authenticated user (Obtenir l'utilisateur actuellement authentifié)
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id; // `req.user` is populated by the `authenticateJWT` middleware (req.user est défini par le middleware `authenticateJWT`)

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] } // Exclude sensitive fields like password (Exclure les champs sensibles comme le mot de passe)
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Return not found if user does not exist (Retourner non trouvé si l'utilisateur n'existe pas)
        }

        return res.status(200).json(user); // Return the authenticated user's data (Retourner les données de l'utilisateur authentifié)
    } catch (error) {
        console.error('Error retrieving current user:', error); // Log errors (Journaliser les erreurs)
        return res.status(500).json({ message: 'Server error' }); // Internal server error (Erreur serveur interne)
    }
};

// Update user password via AuthController (Mettre à jour le mot de passe de l'utilisateur via AuthController)
export const updatePassword = async (req, res) => {
    try {
        const userId = Number(req.params.id); // Extract the user ID from request parameters (Extraire l'ID utilisateur des paramètres de la requête)
        const { password } = req.body; // Extract the new password from request body (Extraire le nouveau mot de passe du corps de la requête)

        // Use AuthController to securely update the password (Utiliser AuthController pour mettre à jour le mot de passe de manière sécurisée)
        await AuthController.updatePassword(req, res);
    } catch (error) {
        console.error('Error updating password:', error); // Log errors (Journaliser les erreurs)
        return res.status(500).end(); // Internal server error (Erreur serveur interne)
    }
};
