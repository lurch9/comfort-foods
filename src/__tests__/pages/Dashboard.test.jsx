import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEnv } from '../../utils/env';
import Dashboard from '../../pages/Dashboard';
/**
 * Unit tests for Dashboard Component
 * 
 * This file contains unit tests for the Dashboard component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles loading states, fetches and displays user profile data,
 * displays error messages on fetch errors, and navigates to the edit profile page on button click.
 * 
 * - Renders loading state initially: Ensures the Dashboard component shows a loading state initially.
 * - Fetches and displays the user profile data: Verifies that the component fetches and correctly displays the user profile data.
 * - Displays error message on fetch error: Ensures the component displays an error message if fetching the user profile data fails.
 * - Navigates to edit profile page on button click: Verifies that the component navigates to the edit profile page when the corresponding button is clicked.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 * - react-router-dom: Mocked to control navigation during tests.
 * - ../context/AuthContext: Mocked to control authentication state during tests.
 * - ../utils/env: Mocked to manage environment variables during tests.
 */

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));

describe('Dashboard Component', () => {
  const mockUser = {
    _id: 'user1',
    name: 'Test User',
    email: 'testuser@example.com',
    street: '123 Main St',
    city: 'Test City',
    state: 'TS',
    zip: '12345',
    dateOfBirth: '1990-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getEnv.mockImplementation((key) => {
      switch (key) {
        case 'VITE_API_BASE_URL':
          return 'http://localhost:5000';
        default:
          return '';
      }
    });

    useAuth.mockReturnValue({
      user: { token: 'fake-token' },
    });

    axios.get.mockResolvedValue({ data: mockUser });
    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders loading state initially', async () => {
    // Introduce a delay in the mocked axios.get call
    axios.get.mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ data: mockUser }), 100)
      )
    );

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays the user profile data', async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Name: Test User')).toBeInTheDocument();
      expect(screen.getByText('Email: testuser@example.com')).toBeInTheDocument();
      expect(screen.getByText('Address: 123 Main St, Test City, TS, 12345')).toBeInTheDocument();
      expect(screen.getByText('Date of Birth: 1/1/1990')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch error', async () => {
    axios.get.mockRejectedValue({ response: { data: { message: 'Fetch failed' } } });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument();
    });
  });

  test('navigates to edit profile page on button click', async () => {
    const navigate = useNavigate();

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));

    expect(navigate).toHaveBeenCalledWith('/profile');
  });
});

