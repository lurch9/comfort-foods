import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../pages/Register';
import { useAuth } from '../../context/AuthContext';
import { getEnv } from '../../utils/env';
/**
 * Unit tests for Register Component
 * 
 * This file contains unit tests for the Register component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles validation errors,
 * registers successfully, and displays error messages on registration failure.
 * 
 * - Renders register form: Ensures the Register component renders the registration form correctly.
 * - Displays validation error on invalid email: Verifies that the component shows a validation error when an invalid email is entered.
 * - Displays validation error on password mismatch: Ensures the component shows a validation error when the passwords do not match.
 * - Registers successfully and redirects based on role: Verifies that the component registers the user successfully and redirects them based on their role.
 * - Displays error message on registration failure: Ensures the component displays an error message if the registration fails.
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

describe('Register Component', () => {
  const API_BASE_URL = 'http://localhost:5000';

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      login: jest.fn(),
    });
    getEnv.mockImplementation((key) => {
      if (key === 'VITE_API_BASE_URL') {
        return API_BASE_URL;
      }
      return undefined;
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  };

  test('renders register form', () => {
    renderComponent();

    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Street:')).toBeInTheDocument();
    expect(screen.getByLabelText('City:')).toBeInTheDocument();
    expect(screen.getByLabelText('State:')).toBeInTheDocument();
    expect(screen.getByLabelText('ZIP Code:')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth:')).toBeInTheDocument();
    expect(screen.getByLabelText('Role:')).toBeInTheDocument();
    expect(screen.getByLabelText('Remember me for 30 days')).toBeInTheDocument();
  });

  test('displays validation error on invalid email', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'invalid-email' } });
    fireEvent.blur(screen.getByLabelText('Email:')); // triggers validation

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  test('displays validation error on password mismatch', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'password' } });
    fireEvent.blur(screen.getByLabelText('Confirm Password:')); // triggers validation

    await waitFor(() => {
      expect(screen.getByText('Passwords must match')).toBeInTheDocument();
    });
  });

  test('registers successfully and redirects based on role', async () => {
    const mockLogin = jest.fn();
    useAuth.mockReturnValue({ login: mockLogin });
    axios.post.mockResolvedValue({ data: { role: 'user' } });

    renderComponent();

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Street:'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City:'), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByLabelText('State:'), { target: { value: 'CA' } });
    fireEvent.change(screen.getByLabelText('ZIP Code:'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Date of Birth:'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText('Role:'), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalledWith(expect.any(Object), false); // Ensure rememberMe is false by default
    });
  });

  test('displays error message on registration failure', async () => {
    axios.post.mockRejectedValue(new Error('Registration failed'));

    renderComponent();

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Street:'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City:'), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByLabelText('State:'), { target: { value: 'CA' } });
    fireEvent.change(screen.getByLabelText('ZIP Code:'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Date of Birth:'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText('Role:'), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });
});
