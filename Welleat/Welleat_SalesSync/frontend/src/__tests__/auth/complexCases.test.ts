import { waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { errorHandler, mockLocalStorage, mockLocation } from './setup';

describe('authMocks', () => {
  test('dummy test', () => {
    expect(true).toBe(true);
  });
});

describe('Complex Cases Tests', () => {
  beforeEach(() => {
    if (!errorHandler) {
      throw new Error('errorHandler not initialized');
    }
  });

  test('should handle multiple consecutive errors', async () => {
    const errors = [401, 403, 500].map(
      status =>
        ({
          response: { status },
        }) as AxiosError
    );

    const errors = [401, 403, 500].map(
      status =>
        ({
          response: { status },
        }) as AxiosError
    );

    if (errorHandler) {
      const promises = errors.map(error => {
        return errorHandler(error).catch(() => {
          // Catch the rejection to prevent unhandled promise rejections
        });
      });

      await Promise.all(promises);

      await waitFor(() => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(toast.error).toHaveBeenCalledTimes(2);
        expect(mockLocation.href).toBe('/');
      });
    }
  });

  test('should handle request cancellation', async () => {
    const mockError = {
      code: 'ECONNABORTED',
      message: 'Request cancelled',
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

  test('should handle concurrent errors correctly', async () => {
    expect(errorHandler).toBeDefined();

    const errors = Array(3)
      .fill(null)
      .map(
        () =>
          ({
            response: { status: 401 },
          }) as AxiosError
      );

    if (errorHandler) {
      const promises = errors.map(error => errorHandler(error).catch(() => {}));

      await Promise.all(promises);

      await waitFor(() => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(mockLocation.href).toBe('/');
      });
    }
  });
});
