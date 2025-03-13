// SimulationPage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SimulationPage from './../Pages/SimulationPage/SimulationPage';

test('validates numerical inputs', () => {
  render(<SimulationPage />);

  const costInput = screen.getByLabelText(/Coût de revient d’un plat/i);
  fireEvent.change(costInput, { target: { value: 'invalid' } });

  // Vérifiez que la valeur par défaut est utilisée en cas d'entrée invalide
  expect(costInput).toHaveValue(0);
});
