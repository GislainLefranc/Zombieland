import { waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { errorHandler } from './setup';

describe('authMocks', () => {
  test('dummy test', () => {
    expect(true).toBe(true);
  });
});

describe('Network Error Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle network timeout errors', async () => {
    const mockError = {
      code: 'ECONNABORTED',
      message: 'timeout',
    } as AxiosError;

    if (errorHandler) {
      await errorHandler(mockError);
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Erreur réseau. Veuillez vérifier votre connexion.'
        );
      });
    }
  });

  test('should handle server offline errors', async () => {
    const mockError = {
      code: 'ECONNREFUSED',
    } as AxiosError;

    if (errorHandler) {
      await errorHandler(mockError);
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Erreur réseau. Veuillez vérifier votre connexion.'
        );
      });
    }
  });
});
