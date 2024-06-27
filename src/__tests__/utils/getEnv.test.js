// src/__tests__/getEnv.test.js
import { getEnv } from '../../utils/env';
/**
 * Unit tests for Environment Variables
 * 
 * This file contains unit tests for verifying environment variables using Jest.
 * It includes tests to ensure that the `getEnv` function correctly returns the expected environment variables.
 * 
 * - getEnv should return API_BASE_URL: Ensures that the `getEnv` function returns the correct value for `API_BASE_URL`.
 * - getEnv should return VITE_STRIPE_PUBLIC_KEY: Ensures that the `getEnv` function returns the correct value for `VITE_STRIPE_PUBLIC_KEY`.
 * - getEnv should return VITE_MAPS_API: Ensures that the `getEnv` function returns the correct value for `VITE_MAPS_API`.
 */

describe('Environment Variables', () => {
  beforeAll(() => {
    // Mock the process.env variables
    process.env.VITE_API_BASE_URL = 'http://localhost:5000';
    process.env.VITE_STRIPE_PUBLIC_KEY = 'mock-stripe-public-key';
    process.env.VITE_MAPS_API = 'mock-maps-api-key';
  });

  test('getEnv should return API_BASE_URL', () => {
    const apiUrl = getEnv('VITE_API_BASE_URL');
    expect(apiUrl).toBe('http://localhost:5000');
  });

  test('getEnv should return VITE_STRIPE_PUBLIC_KEY', () => {
    const stripeKey = getEnv('VITE_STRIPE_PUBLIC_KEY');
    expect(stripeKey).toBe('mock-stripe-public-key');
  });

  test('getEnv should return VITE_MAPS_API', () => {
    const mapsApiKey = getEnv('VITE_MAPS_API');
    expect(mapsApiKey).toBe('mock-maps-api-key');
  });

  afterAll(() => {
    // Clean up the mock environment variables
    delete process.env.VITE_API_BASE_URL;
    delete process.env.VITE_STRIPE_PUBLIC_KEY;
    delete process.env.VITE_MAPS_API;
  });
});


