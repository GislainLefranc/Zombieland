const { Formula } = require('./../src/models/indexModels'); 

async function test() {
  try {
    const formula = await Formula.findByPk(50);
    if (formula) {
      console.log(`Formule trouvée: ${formula.name}`);
    } else {
      console.log('Formule non trouvée');
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

test();
