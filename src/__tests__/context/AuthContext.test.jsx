import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import AuthProvider, { useAuth } from '../../context/AuthContext';
/**
 * Unit tests for AuthContext
 * 
 * This file contains unit tests for the AuthContext component using React Testing Library and Jest.
 * It includes tests to ensure the context initializes correctly, handles user login and logout,
 * updates the user state, and fetches the user profile if a token is present.
 * 
 * - Initializes with guest user if no token is present: Verifies that the context initializes with a guest user state when no token is found.
 * - Logs in and updates user state: Ensures that the context logs in the user and updates the user state accordingly.
 * - Logs out and resets user state: Verifies that the context logs out the user and resets the user state.
 * - Fetches user profile if token is present: Ensures that the context fetches the user profile when a valid token is present.
 */

// Mock axios and js-cookie
const mock = new MockAdapter(axios);
jest.mock('js-cookie');

const TestComponent = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <div>User Role: {user.role}</div>
      <button onClick={() => login({ token: 'test-token', role: 'user', restaurantId: '123' }, true)}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with guest user if no token is present', () => {
    Cookies.get.mockReturnValue(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('User Role: guest')).toBeInTheDocument();
  });

  test('logs in and updates user state', async () => {
    Cookies.get.mockReturnValue(undefined);
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    Cookies.set.mockImplementation(() => {});

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => expect(screen.getByText('User Role: user')).toBeInTheDocument());
    expect(Cookies.set).toHaveBeenCalledWith('token', 'test-token', expect.objectContaining({ secure: true, sameSite: 'Strict', expires: 30 }));
  });

  test('logs out and resets user state', async () => {
    Cookies.get.mockReturnValue('test-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    await waitFor(() => expect(screen.getByText('User Role: guest')).toBeInTheDocument());
    expect(Cookies.remove).toHaveBeenCalledWith('token');
  });

  test('fetches user profile if token is present', async () => {
    Cookies.get.mockReturnValue('test-token');
    mock.onGet(`${process.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/profile`).reply(200, {
      role: 'user',
      restaurantId: '123',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('User Role: user')).toBeInTheDocument());
  });
});
