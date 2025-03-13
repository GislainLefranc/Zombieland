import { waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify'; // Import direct de react-toastify
import { errorHandler, mockLocation, mockLocalStorage } from './authMocks';
import 'react-toastify'; // Assure que le mock est appliqué

describe('Basic Auth Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.removeItem.mockReset();
  });

  test('should redirect to login page on token expiration', async () => {
    expect(errorHandler).toBeDefined();
    const mockError = { response: { status: 401 } } as AxiosError;

    if (errorHandler) {
      await errorHandler(mockError);
      await waitFor(() => {
        expect(mockLocation.href).toBe('/');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      });
    }
  });

  test('should show error toast on 403 response', async () => {
    expect(errorHandler).toBeDefined();
    const mockError = { response: { status: 403 } } as AxiosError;

    if (errorHandler) {
      await errorHandler(mockError);
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Accès interdit.');
      });
    }
  });

  test('should preserve original error message', async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Message original' },
      },
    } as AxiosError;

    if (errorHandler) {
      const error = await errorHandler(mockError).catch(e => e);
      expect(error).toBe(mockError);
    }
  });
});
