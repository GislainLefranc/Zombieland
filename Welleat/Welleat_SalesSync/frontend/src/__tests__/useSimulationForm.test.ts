import { renderHook } from '@testing-library/react-hooks';
import { useSimulationForm } from '../../../hooks/useSimulationForm';

const initialValues = {
  // Définir les valeurs initiales nécessaires pour le test
};

test('useSimulationForm should return expected values', () => {
  const { result } = renderHook(() => useSimulationForm(initialValues));
  expect(result.current).toBeDefined();
});