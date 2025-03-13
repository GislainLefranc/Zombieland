// Dossier: src/controllers
// Fichier: userController.js
// Contrôleur pour les fonctions de gestion des utilisateurs.

const { Op } = require('sequelize');
const {
  User,
  Role,
  Company,
  Interlocutor,
  InterlocutorCompany,
  UserInterlocutor,
  sequelize
} = require('../models/indexModels');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { userSchema, userUpdateSchema } = require('../validators/userValidator');
const notificationService = require('../services/emails/notification.service');
const logger = require('../utils/logger');

/**
 * Inscrire un nouvel utilisateur.
 */
const registerUser = async (req, res) => {
  try {
    const userData = userSchema.parse(req.body);
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Un utilisateur avec cet email existe déjà' });
    }
    const role = await Role.findByPk(userData.roleId);
    if (!role) {
      return res.status(404).json({ error: 'Rôle non trouvé' });
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: new Date(resetTokenExpiry),
    });
    await notificationService.sendAccountNotification(newUser, 'ACCOUNT_CREATION', resetToken);
    return res.status(201).json({ message: 'Utilisateur créé avec succès', user: { id: newUser.id, email: newUser.email, roleId: newUser.roleId } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    logger.error(`Erreur création utilisateur : ${error.message}`, { stack: error.stack });
    return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};

/**
 * Créer un utilisateur (similaire à registerUser).
 */
const createUser = async (req, res) => {
  try {
    const userData = userSchema.parse(req.body);
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Un utilisateur avec cet email existe déjà' });
    }
    const role = await Role.findByPk(userData.roleId);
    if (!role) {
      return res.status(404).json({ error: 'Rôle non trouvé' });
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: new Date(resetTokenExpiry),
    });
    await notificationService.sendAccountNotification(newUser, 'ACCOUNT_CREATION', resetToken);
    return res.status(201).json({ message: 'Utilisateur créé avec succès', user: { id: newUser.id, email: newUser.email, roleId: newUser.roleId } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};

/**
 * Récupérer la liste de tous les utilisateurs.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: { model: Role, as: 'role' },
      attributes: { exclude: ['password'] },
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté.
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Role, as: 'role', attributes: ['id', 'name'] },
        { model: Company, as: 'companies' },
        { model: Interlocutor, as: 'interlocutors' },
      ],
    });
    if (!user) {
      logger.warn(`Utilisateur non trouvé : ID ${userId}`);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    return res.json(user);
  } catch (error) {
    logger.error(`Erreur récupération profil utilisateur : ${error.message}`, { stack: error.stack, userId: req.user.id });
    return res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
};

/**
 * Mettre à jour le profil de l'utilisateur connecté.
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    const userData = userUpdateSchema.parse(req.body);
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await user.update(userData);
    return res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user: { id: user.id, email: user.email, roleId: user.roleId } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};

/**
 * Supprimer un utilisateur.
 * En cas d'associations, effectuer un soft delete.
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    const associatedCompanies = await user.getCompanies();
    const associatedInterlocutors = await user.getInterlocutors();
    if (associatedCompanies.length > 0 || associatedInterlocutors.length > 0) {
      await user.setCompanies([]);
      await user.setInterlocutors([]);
      return res.status(200).json({ message: "Utilisateur dissocié des entreprises et interlocuteurs" });
    } else {
      await user.destroy({ force: true });
      return res.status(200).json({ message: 'Utilisateur supprimé définitivement' });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
  }
};

/**
 * Récupérer les détails d'un utilisateur par son ID.
 */
const getUserDetail = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Company,
          as: 'companies',
          through: { attributes: [] },
          attributes: ['id', 'name', 'address', 'city', 'postal_code'],
          include: [
            {
              model: Interlocutor,
              as: 'interlocutors',
              through: { attributes: [] },
              attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'position']
            }
          ]
        },
        {
          model: Interlocutor,
          as: 'interlocutors',
          required: false,
          through: { attributes: [] },
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'position', 'interlocutor_type', 'comment', 'is_principal', 'is_independent']
        },
        { model: Role, as: 'role' }
      ],
      attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expires'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const transformedUser = {
      ...user.toJSON(),
      companies: user.companies.map(company => ({
        id: company.id,
        name: company.name,
        address: company.address,
        city: company.city,
        postalCode: company.postal_code,
        interlocutors: company.interlocutors.map(interlocutor => ({
          id: interlocutor.id,
          firstName: interlocutor.first_name,
          lastName: interlocutor.last_name,
          email: interlocutor.email,
          phone: interlocutor.phone,
          position: interlocutor.position
        }))
      })),
      interlocutors: user.interlocutors.map(interlocutor => ({
        id: interlocutor.id,
        firstName: interlocutor.first_name,
        lastName: interlocutor.last_name,
        email: interlocutor.email,
        phone: interlocutor.phone,
        position: interlocutor.position,
        interlocutorType: interlocutor.interlocutor_type,
        comment: interlocutor.comment,
        isPrincipal: interlocutor.is_principal,
        isIndependent: interlocutor.is_independent
      }))
    };
    res.json(transformedUser);
  } catch (error) {
    console.error('Erreur getUserDetail :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des détails utilisateur' });
  }
};

/**
 * Récupérer les données assignées à un utilisateur.
 */
const getUserAssignedData = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Récupération des données assignées pour l'utilisateur ${id}`);
    const userData = await User.findOne({
      where: { id: Number(id) },
      include: [
        {
          model: Company,
          as: 'companies',
          through: { attributes: [] }
        },
        {
          model: Interlocutor,
          as: 'interlocutors',
          through: { model: UserInterlocutor, attributes: ['is_principal'] },
          include: [
            {
              model: Company,
              as: 'companies',
              through: { model: InterlocutorCompany, attributes: ['is_principal'] }
            }
          ]
        }
      ]
    });
    if (!userData) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const response = {
      ...userData.get({ plain: true }),
      interlocutors: userData.interlocutors?.map(interlocutor => ({
        id: interlocutor.id,
        firstName: interlocutor.first_name,
        lastName: interlocutor.last_name,
        email: interlocutor.email,
        phone: interlocutor.phone,
        position: interlocutor.position,
        comment: interlocutor.comment,
        isPrincipal: interlocutor.Users_Interlocutors?.is_principal || false,
        companies: interlocutor.companies?.map(company => ({
          id: company.id,
          name: company.name,
          isPrincipal: company.InterlocutorCompany?.is_principal || false
        }))
      })) || []
    };
    res.json(response);
  } catch (error) {
    logger.error('Erreur lors de la récupération des données assignées :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des données assignées',
      error: error.message
    });
  }
};

/**
 * Vérifier l'existence d'emails parmi les utilisateurs.
 */
const checkEmails = async (req, res) => {
  try {
    const { emails } = req.body;
    const existingUsers = await User.findAll({ where: { email: { [Op.in]: emails } }, attributes: ['email'] });
    const existingEmails = existingUsers.map(u => u.email);
    const newEmails = emails.filter(email => !existingEmails.includes(email));
    return res.json({ existingEmails, newEmails });
  } catch (error) {
    logger.error(`Erreur vérification emails : ${error.message}`);
    return res.status(500).json({ error: 'Erreur lors de la vérification des emails' });
  }
};

/**
 * Récupérer les entreprises associées à l'utilisateur connecté.
 */
const getUserCompanies = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRoleId = req.user.role_id;
    let companies = [];
    if (userRoleId === 1) {
      companies = await Company.findAll();
    } else {
      companies = await sequelize.query(`
        SELECT c.* 
        FROM "Companies" c
        JOIN "Users_Companies" uc ON c.id = uc.company_id 
        WHERE uc.user_id = :userId
      `, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      });
      if (companies.length === 0) {
        companies = await Company.findAll({ where: { [Op.or]: [{ created_by: userId }, { assigned_to: userId }] } });
      }
    }
    return res.json(companies);
  } catch (error) {
    logger.error(`Erreur getUserCompanies : ${error.message}`);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Récupérer les interlocuteurs associés à l'utilisateur connecté.
 */
const getUserInterlocutors = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ where: { id: userId }, include: [{ model: Interlocutor, as: 'interlocutors' }] });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    return res.json(user.interlocutors || []);
  } catch (error) {
    logger.error(`Erreur getUserInterlocutors : ${error.message}`);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

/**
 * Récupérer les informations de l'utilisateur connecté.
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Company, as: 'companies', through: { attributes: [] } },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Erreur getMe : ${error.message}`);
    return res.status(500).json({ message: 'Erreur lors de la récupération des détails de l\'utilisateur' });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserDetail,
  createUser,
  getUserAssignedData,
  checkEmails,
  getUserCompanies,
  getUserInterlocutors,
  getMe,
  User,
  Role,
  Company,
  Interlocutor,
  UserInterlocutor,
  InterlocutorCompany,
};
