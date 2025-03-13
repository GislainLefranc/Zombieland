import { AxiosError } from 'axios';

describe('authMocks', () => {
  test('dummy test', () => {
    expect(true).toBe(true);
  });
});

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Variables globales
export let errorHandler: ((error: AxiosError) => Promise<any>) | null = null;

// Mock window.location
export const mockLocation = { href: '' };
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock localStorage
export const mockLocalStorage = {
  removeItem: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock axiosInstance
jest.mock('../../api/axiosInstance', () => ({
  interceptors: {
    response: {
      use: jest.fn((successFn: any, errorFn: any) => {
        errorHandler = errorFn;
        return { eject: jest.fn() };
      }),
    },
  },
}));
