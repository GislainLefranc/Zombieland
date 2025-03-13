// Dossier: controllers
// Fichier: roleController.js
// Contrôleur pour les fonctions de gestion des rôles.

const { Role, User } = require('../models/indexModels');
const { z } = require('zod');
const { roleSchema, roleUpdateSchema } = require('../validators/roleValidator');
const logger = require('../utils/logger');

/**
 * Créer un rôle (admin uniquement).
 */
const createRole = async (req, res) => {
  try {
    if (req.user.roleId !== 1)
      return res.status(403).json({ error: 'Accès refusé.' });
    const data = roleSchema.parse(req.body);
    const newRole = await Role.create({ name: data.name });
    res.status(201).json({ message: 'Rôle créé avec succès', role: newRole });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.errors });
    if (error.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ error: 'Un rôle avec ce nom existe déjà.' });
    logger.error(`Erreur création rôle : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la création du rôle' });
  }
};

/**
 * Récupérer tous les rôles (admin uniquement).
 */
const getAllRoles = async (req, res) => {
  try {
    if (req.user.roleId !== 1)
      return res.status(403).json({ error: 'Accès refusé.' });
    const roles = await Role.findAll({ include: [{ model: User, as: 'users', attributes: ['id', 'firstName', 'lastName', 'email'] }] });
    res.status(200).json(roles);
  } catch (error) {
    logger.error(`Erreur récupération rôles : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la récupération des rôles' });
  }
};

/**
 * Récupérer un rôle par son ID (admin uniquement).
 */
const getRoleById = async (req, res) => {
  try {
    if (req.user.roleId !== 1)
      return res.status(403).json({ error: 'Accès refusé.' });
    const { id } = req.params;
    const role = await Role.findByPk(id, { include: [{ model: User, as: 'users', attributes: ['id', 'firstName', 'lastName', 'email'] }] });
    if (!role)
      return res.status(404).json({ error: 'Rôle non trouvé.' });
    res.status(200).json(role);
  } catch (error) {
    logger.error(`Erreur récupération rôle : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la récupération du rôle' });
  }
};

/**
 * Mettre à jour un rôle (admin uniquement).
 */
const updateRole = async (req, res) => {
  try {
    if (req.user.roleId !== 1)
      return res.status(403).json({ error: 'Accès refusé.' });
    const { id } = req.params;
    const data = roleUpdateSchema.partial().parse(req.body);
    const role = await Role.findByPk(id);
    if (!role)
      return res.status(404).json({ error: 'Rôle non trouvé.' });
    await role.update(data);
    res.status(200).json({ message: 'Rôle mis à jour avec succès', role });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.errors });
    if (error.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ error: 'Un rôle avec ce nom existe déjà.' });
    logger.error(`Erreur mise à jour rôle : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle' });
  }
};

/**
 * Supprimer un rôle (admin uniquement).
 */
const deleteRole = async (req, res) => {
  try {
    if (req.user.roleId !== 1)
      return res.status(403).json({ error: 'Accès refusé.' });
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role)
      return res.status(404).json({ error: 'Rôle non trouvé.' });
    await role.destroy();
    res.status(200).json({ message: 'Rôle supprimé avec succès.' });
  } catch (error) {
    logger.error(`Erreur suppression rôle : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la suppression du rôle' });
  }
};

module.exports = { createRole, getAllRoles, getRoleById, updateRole, deleteRole };
