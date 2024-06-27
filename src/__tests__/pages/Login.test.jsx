import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEnv } from '../../utils/env';
import Login from '../../pages/Login';
/**
 * Unit tests for Login Component
 * 
 * This file contains unit tests for the Login component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles successful login,
 * and displays error messages on login failure.
 * 
 * - Renders Login form: Verifies the login form elements are rendered correctly.
 * - Submits login form successfully: Mocks an API call for login and checks that the form is submitted and the user is redirected.
 * - Handles login error: Mocks an API error response and checks that the error message is displayed.
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

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

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
      login: mockLogin,
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Remember me for 30 days')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays validation errors', async () => {
    await act(async () => {
      render(<Login />);
    });

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: '' } });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      const errorMessages = screen.getAllByText('Required');
      expect(errorMessages.length).toBe(2); // One for email and one for password
    });
  });

  test('handles successful login', async () => {
    axios.post.mockResolvedValue({
      data: {
        _id: 'user1',
        name: 'Test User',
        role: 'user',
        token: 'fake-token',
      },
    });

    await act(async () => {
      render(<Login />);
    });

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText('Remember me for 30 days'));

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        _id: 'user1',
        name: 'Test User',
        role: 'user',
        token: 'fake-token',
      }, true);
      expect(mockNavigate).toHaveBeenCalledWith('/restaurants');
    });
  });

  test('handles successful login for manager', async () => {
    axios.post.mockResolvedValue({
      data: {
        _id: 'user1',
        name: 'Test User',
        role: 'manager',
        token: 'fake-token',
      },
    });

    await act(async () => {
      render(<Login />);
    });

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'manager@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText('Remember me for 30 days'));

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        _id: 'user1',
        name: 'Test User',
        role: 'manager',
        token: 'fake-token',
      }, true);
      expect(mockNavigate).toHaveBeenCalledWith('/manager-dashboard');
    });
  });

  test('handles login error', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Login failed' } },
    });

    await act(async () => {
      render(<Login />);
    });

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument();
    });
  });
});
