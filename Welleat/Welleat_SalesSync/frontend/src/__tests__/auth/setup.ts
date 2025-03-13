import { AxiosError } from 'axios';

export let errorHandler: ((error: AxiosError) => Promise<any>) | null = null;

export const mockLocation = { href: '' };
export const mockLocalStorage = {
  removeItem: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn(),
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));
