// Dossier : src/controllers
// Fichier : dashboardController.js

const { Op } = require('sequelize');
const { Company, Interlocutor, User } = require('../models/indexModels');

/**
 * Récupère les données du tableau de bord en fonction du rôle de l'utilisateur.
 * Pour l'admin, toutes les entreprises et interlocuteurs sont renvoyés,
 * tandis que pour un Sales_User, seules les entreprises liées à l'utilisateur sont récupérées.
 */
const getDashboardData = async (req, res) => {
  try {
    const { id: userId, roleId } = req.user;
    let companies = [];
    let interlocutors = [];

    if (roleId === 1) {
      // Pour un administrateur : récupération de toutes les entreprises et interlocuteurs
      const [fetchedCompanies, fetchedInterlocutors] = await Promise.all([
        Company.findAll({
          include: [
            { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { model: User, as: 'users', attributes: ['id'], through: { attributes: [] } },
            { model: Interlocutor, as: 'interlocutors', through: { attributes: [] } },
          ],
          attributes: ['id', 'name', 'address', 'city', 'postalCode', 'establishmentType'],
          distinct: true,
        }),
        Interlocutor.findAll({
          include: [
            { model: Company, as: 'companies', attributes: ['id', 'name'], through: { attributes: [] } },
          ],
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'position', 'isPrincipal', 'isIndependent'],
        }),
      ]);
      companies = fetchedCompanies;
      interlocutors = fetchedInterlocutors;
    } else if (roleId === 2) {
      // Pour un Sales_User : récupération des entreprises liées à l'utilisateur
      companies = await Company.findAll({
        where: { [Op.or]: [{ created_by: userId }, { assigned_to: userId }] },
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'users', attributes: ['id'], through: { attributes: [] } },
          { model: Interlocutor, as: 'interlocutors', through: { attributes: ['isPrincipal'] } },
        ],
        attributes: ['id', 'name', 'address', 'city', 'postalCode', 'created_by', 'assigned_to', 'createdAt', 'updatedAt'],
        distinct: true,
      });
      const companyIds = companies.map(c => c.id);
      if (companyIds.length > 0) {
        interlocutors = await Interlocutor.findAll({
          where: {
            [Op.or]: [
              { userId: userId },
              { '$companies.created_by$': userId, '$companies.assigned_to$': userId },
            ],
          },
          include: [{
            model: Company,
            as: 'companies',
            required: true,
            where: { [Op.or]: [{ created_by: userId }, { assigned_to: userId }] },
          }],
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'position', 'isPrincipal', 'isIndependent'],
          distinct: true,
        });
      }
    } else {
      return res.status(403).json({ message: `Accès non autorisé pour roleId: ${roleId}` });
    }

    return res.status(200).json({
      companies: companies || [],
      interlocutors: interlocutors || []
    });
  } catch (error) {
    console.error('Erreur dashboard :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = { getDashboardData };
