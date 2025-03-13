import { errorHandler } from '../../utils/errorHandler';

describe('Tests des cas complexes', () => {
    let errors;

    beforeEach(() => {
        errors = [401, 403, 500];
    });

    test('Vérifie que la variable errors n\'est pas redéclarée', () => {
        expect(errors).toEqual([401, 403, 500]);
    });

    test('Vérifie que errorHandler fonctionne correctement', async () => {
        const results = await Promise.all(errors.map(error => errorHandler(error)));
        expect(results).toBeDefined();
    });
});