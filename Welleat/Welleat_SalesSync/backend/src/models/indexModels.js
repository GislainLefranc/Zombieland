const { Sequelize, DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/sequelize');

// Import des factories de chaque modèle
const roleFactory = require('./roleModel');
const userFactory = require('./userModel');
const companyFactory = require('./companyModel');
const interlocutorFactory = require('./interlocutorModel');
const functioningFactory = require('./functioningModel');
const simulationFactory = require('./simulationModel');
const interlocutorCompanyFactory = require('./interlocutorCompanyModel');
const userInterlocutorFactory = require('./userInterlocutorModel');
const equipmentFactory = require('./equipmentModel');
const quoteFactory = require('./quoteModel');
const quoteEquipmentFactory = require('./quoteEquipmentModel');
const formulaFactory = require('./formulaModel');
const optionFactory = require('./optionModel');
const formulaOptionsFactory = require('./formulaOptionModel');
const optionCategoryFactory = require('./optionCategoryModel');
const equipmentCategoryFactory = require('./equipmentCategoryModel');
const userCompanyFactory = require('./userCompanyModel');
const quotesInterlocutorsFactory = require('./quotesInterlocutorsModel');
const quoteOptionsFactory = require('./quoteOptionsModel');

// Initialisation des modèles
const Role = roleFactory(sequelize, DataTypes);
const User = userFactory(sequelize, DataTypes);
const Company = companyFactory(sequelize, DataTypes);
const Interlocutor = interlocutorFactory(sequelize, DataTypes);
const Functioning = functioningFactory(sequelize, DataTypes);
const Simulation = simulationFactory(sequelize, DataTypes);
const InterlocutorCompany = interlocutorCompanyFactory(sequelize, DataTypes);
const UserInterlocutor = userInterlocutorFactory(sequelize, DataTypes);
const Equipment = equipmentFactory(sequelize, DataTypes);
const Quote = quoteFactory(sequelize, DataTypes);
const QuoteEquipment = quoteEquipmentFactory(sequelize, DataTypes);
const Formula = formulaFactory(sequelize, DataTypes);
const Option = optionFactory(sequelize, DataTypes);
const Formula_Options = formulaOptionsFactory(sequelize, DataTypes);
const OptionCategory = optionCategoryFactory(sequelize, DataTypes);
const EquipmentCategory = equipmentCategoryFactory(sequelize, DataTypes);
const UserCompany = userCompanyFactory(sequelize, DataTypes);
const QuotesInterlocutors = quotesInterlocutorsFactory(sequelize, DataTypes);
const QuoteOptions = quoteOptionsFactory(sequelize, DataTypes);

// Définition des associations

// Rôle <-> Utilisateur (1:N)
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// Utilisateur <-> Entreprise (M:N)
User.belongsToMany(Company, {
  through: UserCompany,
  foreignKey: 'user_id',
  otherKey: 'company_id',
  as: 'companies',
});
Company.belongsToMany(User, {
  through: UserCompany,
  foreignKey: 'company_id',
  otherKey: 'user_id',
  as: 'users',
});

// Entreprise -> Utilisateur (créateur et assigné)
Company.belongsTo(User, { foreignKey: 'created_by', as: 'creator', onDelete: 'RESTRICT' });
Company.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser', onDelete: 'SET NULL' });

// Utilisateur <-> Interlocuteur (M:N via table de jointure)
User.belongsToMany(Interlocutor, {
  through: UserInterlocutor,
  foreignKey: 'user_id',
  otherKey: 'interlocutor_id',
  as: 'interlocutors',
});
Interlocutor.belongsToMany(User, {
  through: UserInterlocutor,
  foreignKey: 'interlocutor_id',
  otherKey: 'user_id',
  as: 'users',
});

// Quote <-> Equipment (M:N)
Quote.belongsToMany(Equipment, {
  through: QuoteEquipment,
  as: 'equipments',
  foreignKey: 'quote_id',
});
Equipment.belongsToMany(Quote, {
  through: QuoteEquipment,
  as: 'quotes',
  foreignKey: 'equipment_id',
});

// Association directe Utilisateur -> Interlocuteur (1:N)
User.hasMany(Interlocutor, { foreignKey: 'userId', as: 'directInterlocutors' });
Interlocutor.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Entreprise <-> Interlocuteur (M:N via InterlocutorCompany)
Company.belongsToMany(Interlocutor, {
  through: InterlocutorCompany,
  foreignKey: 'company_id',
  otherKey: 'interlocutor_id',
  as: 'interlocutors',
});
Interlocutor.belongsToMany(Company, {
  through: InterlocutorCompany,
  foreignKey: 'interlocutor_id',
  otherKey: 'company_id',
  as: 'companies',
});

// Association entre Interlocuteur et InterlocutorCompany
Interlocutor.hasMany(InterlocutorCompany, { foreignKey: 'interlocutor_id', as: 'InterlocutorCompany' });
InterlocutorCompany.belongsTo(Interlocutor, { foreignKey: 'interlocutor_id' });

// Entreprise <-> Fonctionnement (1:N)
Company.hasMany(Functioning, { foreignKey: 'company_id', as: 'functionings', onDelete: 'CASCADE' });
Functioning.belongsTo(Company, { foreignKey: 'company_id', as: 'company', onDelete: 'CASCADE' });

// Quote <-> Utilisateur (N:1)
User.hasMany(Quote, { foreignKey: 'user_id', as: 'quotes', onDelete: 'CASCADE' });
Quote.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });

// Quote <-> Entreprise (N:1)
Company.hasMany(Quote, { foreignKey: 'company_id', as: 'companyQuotes', onDelete: 'SET NULL' });
Quote.belongsTo(Company, { foreignKey: 'company_id', as: 'company', onDelete: 'SET NULL' });

// Quote <-> Formula (N:1)
Quote.belongsTo(Formula, { foreignKey: 'formula_id', as: 'formula', onDelete: 'SET NULL' });
Formula.hasMany(Quote, { foreignKey: 'formula_id', as: 'quotes' });

// Formula <-> Option (M:N)
Formula.belongsToMany(Option, { through: Formula_Options, foreignKey: 'formula_id', otherKey: 'option_id', as: 'options' });
Option.belongsToMany(Formula, { through: Formula_Options, foreignKey: 'option_id', otherKey: 'formula_id', as: 'formulas' });

// Quote <-> Option (M:N)
Quote.belongsToMany(Option, { through: 'Quotes_Options', foreignKey: 'quote_id', otherKey: 'option_id', as: 'options' });
Option.belongsToMany(Quote, { through: 'Quotes_Options', foreignKey: 'option_id', otherKey: 'quote_id', as: 'quotes' });

// Quote <-> Interlocuteur (M:N)
Quote.belongsToMany(Interlocutor, { through: QuotesInterlocutors, foreignKey: 'quote_id', otherKey: 'interlocutor_id', as: 'interlocutors' });
Interlocutor.belongsToMany(Quote, { through: QuotesInterlocutors, foreignKey: 'interlocutor_id', otherKey: 'quote_id', as: 'quotes' });

// Option <-> OptionCategory (N:1)
Option.belongsTo(OptionCategory, { foreignKey: 'category_id', as: 'category', onDelete: 'SET NULL' });
OptionCategory.hasMany(Option, { foreignKey: 'category_id', as: 'options' });

// Equipment <-> EquipmentCategory (N:1)
Equipment.belongsTo(EquipmentCategory, { foreignKey: 'category_id', as: 'category', onDelete: 'SET NULL' });
EquipmentCategory.hasMany(Equipment, { foreignKey: 'category_id', as: 'equipments' });

// Formula <-> QuoteEquipment (1:M)
Formula.hasMany(QuoteEquipment, { foreignKey: 'formula_id', as: 'quoteEquipments', onDelete: 'SET NULL' });
QuoteEquipment.belongsTo(Formula, { foreignKey: 'formula_id', as: 'formula' });

// Simulation <-> Entreprise (N:1)
Simulation.belongsTo(Company, { foreignKey: 'company_id', as: 'company', onDelete: 'CASCADE' });
Company.hasMany(Simulation, { foreignKey: 'company_id', as: 'simulations' });

module.exports = {
  sequelize,
  Sequelize,
  Op,
  Role,
  User,
  Company,
  Interlocutor,
  Functioning,
  Simulation,
  InterlocutorCompany,
  UserCompany,
  UserInterlocutor,
  Equipment,
  Quote,
  QuoteEquipment,
  QuotesInterlocutors,
  QuoteOptions,
  Formula,
  Option,
  Formula_Options,
  OptionCategory,
  EquipmentCategory,
};
