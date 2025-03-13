// test/integration/associationOps.test.js

const { sequelize, User, Company, Role } = require('../../src/models/indexModels');

describe('Association Operations (Opérations d\'associations)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await Role.create({ id: 1, name: 'Admin', description: 'Administrateur' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer une Company associée à un User', async () => {
    const user = await User.create({
      lastName: 'Test',
      firstName: 'User',
      email: 'test.user@example.com',
      password: 'hashedpassword',
      roleId: 1,
    });

    const newCompany = await Company.create({
      name: 'Test Company',
      address: '123 Test Street',
      city: 'Testville',
      postalCode: '12345',
      establishmentType: 'client potentiel',
      organizationType: 'collectivité',
      numberOfCanteens: 1,
      numberOfCentralKitchens: 1,
      createdBy: user.id,
      assignedTo: user.id,
    });

    const fetchedCompany = await Company.findByPk(newCompany.id, {
      include: [{ model: User, as: 'createdByUser' }], // Utiliser l'alias correct
    });

    expect(fetchedCompany).toBeDefined();
    expect(fetchedCompany.createdByUser).toBeDefined();
    expect(fetchedCompany.createdByUser.email).toBe(user.email);
  });
});