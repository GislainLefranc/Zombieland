// useSimulationForm.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useSimulationForm } from '../../hooks/useSimulationForm';

test('useSimulationForm initializes properly', () => {
  const { result } = renderHook(() => useSimulationForm(initialValues));
  expect(result.current).toBeDefined();
});

test('calculates correct savings', () => {
  const { result } = renderHook(() => useSimulationForm(initialValues));

  act(() => {
    result.current.setValues({
      costPerDish: 3,
      dishesPerDay: 2000,
      wastePercentage: 30,
    });
  });

  const results = result.current.calculateResults();

  expect(results.dailyProductionSavings).toBeCloseTo(3 * 2000 * 0.14, 2);
  expect(results.monthlyProductionSavings).toBeCloseTo(3 * 2000 * 0.14 * 18, 2);
  expect(results.dailyWasteSavings).toBeCloseTo(3 * 2000 * 0.3 * 0.45, 2);
  expect(results.monthlyWasteSavings).toBeCloseTo(
    3 * 2000 * 0.3 * 0.45 * 18,
    2
  );
});
