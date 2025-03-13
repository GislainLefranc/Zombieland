import { waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { errorHandler, mockLocation, mockLocalStorage } from './authMocks';
import 'react-toastify'; // Assure que le mock est appliqué

describe('Token Handling Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.removeItem.mockReset();
  });

  test('should handle malformed token in localStorage', async () => {
    mockLocalStorage.getItem.mockReturnValue('malformed-json');
    const mockError = { response: { status: 401 } } as AxiosError;

    if (errorHandler) {
      await errorHandler(mockError);
      await waitFor(() => {
        expect(mockLocation.href).toBe('/');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      });
    }
  });

  test('should handle invalid token format', async () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ invalidFormat: true })
    );
    const mockError = { response: { status: 401 } } as AxiosError;

    if (errorHandler) {
      await errorHandler(mockError);
      await waitFor(() => {
        expect(mockLocation.href).toBe('/');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      });
    }
  });

  test('should handle valid token correctly', async () => {
    const validToken = JSON.stringify({ token: 'valid-token' });
    mockLocalStorage.getItem.mockReturnValue(validToken);

    const mockError = { response: { status: 401 } } as AxiosError;

    if (errorHandler) {
      await errorHandler(mockError);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
    }
  });
});
