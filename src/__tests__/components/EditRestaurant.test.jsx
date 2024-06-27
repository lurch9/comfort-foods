import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEnv } from '../../utils/env';
import EditRestaurant from '../../components/EditRestaurant';
/**
 * Unit tests for EditRestaurant Component
 * 
 * This file contains unit tests for the EditRestaurant component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles form input changes,
 * submits the form, and handles form submission errors.
 * 
 * - Renders loading state initially: Verifies the component displays a loading state initially.
 * - Fetches and displays the restaurant data: Mocks an API call to fetch restaurant data and checks that the data is displayed correctly.
 * - Handles form input changes: Checks that the component correctly handles changes to the form inputs.
 * - Submits the form successfully: Mocks an API call to submit the form and checks that the form is submitted with the correct data.
 * - Handles form submission error: Mocks an API error response and checks that the component displays error messages correctly.
 */

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));

describe('EditRestaurant Component', () => {
  const mockRestaurant = {
    name: 'Sample Restaurant',
    address: {
      street: '123 Main St',
      city: 'Sample City',
      state: 'CA',
      zip: '12345',
    },
    contact: '123-456-7890',
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

    useParams.mockReturnValue({ id: 'restaurant1' });
    useNavigate.mockReturnValue(jest.fn());
    useAuth.mockReturnValue({
      user: { token: 'fake-token' },
    });

    axios.get.mockImplementation(() =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: mockRestaurant }), 100)
        )
      );
    axios.put.mockResolvedValue({});
  });

  test('renders loading state initially', async () => {
    await act(async () => {
      render(<EditRestaurant />);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays the restaurant data', async () => {
    await act(async () => {
      render(<EditRestaurant />);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Sample Restaurant')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Sample City')).toBeInTheDocument();
      expect(screen.getByDisplayValue('CA')).toBeInTheDocument();
      expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
    });
  });

  test('handles form input changes', async () => {
    await act(async () => {
      render(<EditRestaurant />);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Sample Restaurant')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(screen.getByDisplayValue('Sample Restaurant'), { target: { value: 'Updated Restaurant' } });
    });
    expect(screen.getByDisplayValue('Updated Restaurant')).toBeInTheDocument();
  });

  test('submits the form successfully', async () => {
    const navigate = useNavigate();

    await act(async () => {
      render(<EditRestaurant />);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Sample Restaurant')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.submit(screen.getByText('Update Restaurant'));
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/manager-dashboard');
    });
  });

  test('handles form submission error', async () => {
    axios.put.mockRejectedValue({ response: { data: { message: 'Update failed' } } });

    await act(async () => {
      render(<EditRestaurant />);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Sample Restaurant')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.submit(screen.getByText('Update Restaurant'));
    });

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });
});
