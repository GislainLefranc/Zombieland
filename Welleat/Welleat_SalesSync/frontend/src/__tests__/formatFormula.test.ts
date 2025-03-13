import { formatFormulaData, toNumber } from '../formatFormula';

test('formatFormulaData should format data correctly', () => {
    const input = { /* vos données d'entrée ici */ };
    const expectedOutput = { /* votre sortie attendue ici */ };
    expect(formatFormulaData(input)).toEqual(expectedOutput);
});

test('toNumber should convert values correctly', () => {
    expect(toNumber('123')).toBe(123);
    expect(toNumber('abc')).toBeNaN();
});