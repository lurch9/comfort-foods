import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Profile from '../../pages/Profile';
import { getEnv } from '../../utils/env';
/**
 * Unit tests for Profile Component
 * 
 * This file contains unit tests for the Profile component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, updates the profile successfully,
 * displays validation errors on invalid inputs, and shows error messages on submission errors.
 * 
 * - Renders profile form with user data: Ensures the Profile component renders the profile form populated with the user's data.
 * - Updates profile successfully: Verifies that the component correctly updates the user's profile with valid inputs.
 * - Displays validation error on invalid email: Ensures the component shows a validation error when an invalid email is entered.
 * - Displays error message on submission error: Verifies that the component displays an error message if the profile submission fails.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 * - ../context/AuthContext: Mocked to control authentication state during tests.
 * - ../utils/env: Mocked to manage environment variables during tests.
 */

jest.mock('axios');
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));

describe('Profile Component', () => {
  const API_BASE_URL = 'http://localhost:5000';

  const mockUser = {
    token: 'fake-token',
    name: 'John Doe',
    email: 'john@example.com',
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    dateOfBirth: '1990-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
    });
    getEnv.mockImplementation((key) => {
      if (key === 'VITE_API_BASE_URL') {
        return API_BASE_URL;
      }
      return undefined;
    });
  });

  test('renders profile form with user data', async () => {
    await act(async () => {
      render(<Profile />);
    });

    expect(screen.getByLabelText('Name:')).toHaveValue(mockUser.name);
    expect(screen.getByLabelText('Email:')).toHaveValue(mockUser.email);
    expect(screen.getByLabelText('Street:')).toHaveValue(mockUser.street);
    expect(screen.getByLabelText('City:')).toHaveValue(mockUser.city);
    expect(screen.getByLabelText('State:')).toHaveValue(mockUser.state);
    expect(screen.getByLabelText('Zip Code:')).toHaveValue(mockUser.zip);
    expect(screen.getByLabelText('Date of Birth:')).toHaveValue('1990-01-01');
  });

  test('updates profile successfully', async () => {
    const updatedUser = { ...mockUser, name: 'Jane Doe' };
    axios.put.mockResolvedValue({ data: updatedUser });
    const setUser = jest.fn();
    useAuth.mockReturnValue({ user: mockUser, setUser });

    await act(async () => {
      render(<Profile />);
    });

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByText('Update Profile'));

    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith(updatedUser);
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
  });

  test('displays validation error on invalid email', async () => {
    render(<Profile />);

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'invalid-email' } });
    fireEvent.blur(screen.getByLabelText('Email:')); // triggers validation

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  test('displays error message on submission error', async () => {
    axios.put.mockRejectedValue({ response: { data: { message: 'Update failed' } } });

    await act(async () => {
      render(<Profile />);
    });

    fireEvent.click(screen.getByText('Update Profile'));

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });
});
