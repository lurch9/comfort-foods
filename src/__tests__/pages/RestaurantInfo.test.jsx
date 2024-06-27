import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RestaurantInfo from '../../pages/RestaurantInfo';
import { getEnv } from '../../utils/env';
import { useParams } from 'react-router-dom';
/**
 * Unit tests for RestaurantInfo Component
 * 
 * This file contains unit tests for the RestaurantInfo component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles loading states, fetches and displays restaurant details,
 * and shows an error message on fetch error.
 * 
 * - Renders loading state initially: Ensures the RestaurantInfo component shows a loading state initially.
 * - Fetches and displays restaurant details: Verifies that the component fetches and correctly displays the restaurant details.
 * - Shows Loading... on fetch error: Ensures the component displays a loading or error message if fetching restaurant details fails.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 * - react-router-dom: Mocked to control navigation during tests.
 * - ../utils/env: Mocked to manage environment variables during tests.
 */

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));

describe('RestaurantInfo Component', () => {
  const API_BASE_URL = 'http://localhost:5000';

  beforeEach(() => {
    jest.clearAllMocks();
    getEnv.mockImplementation((key) => {
      if (key === 'VITE_API_BASE_URL') {
        return API_BASE_URL;
      }
      return undefined;
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/restaurant/restaurant1']}>
        <Routes>
          <Route path="/restaurant/:id" element={<RestaurantInfo />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    useParams.mockReturnValue({ id: 'restaurant1' });

    renderComponent();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays restaurant details', async () => {
    const mockRestaurant = {
      name: 'Test Restaurant',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip: '12345',
      },
      contact: '123-456-7890',
    };

    axios.get.mockResolvedValue({ data: mockRestaurant });
    useParams.mockReturnValue({ id: 'restaurant1' });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
      expect(screen.getByText('123 Test St, Test City, TS 12345')).toBeInTheDocument();
      expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    });
  });

  test('Shows Loading... on fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Fetch failed'));
    useParams.mockReturnValue({ id: 'restaurant1' });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument(); 
    });
  });
});
