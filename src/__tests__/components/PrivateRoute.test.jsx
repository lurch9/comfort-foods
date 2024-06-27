import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PrivateRoute from '../../components/PrivateRoute';
/**
 * Unit tests for PrivateRoute Component
 * 
 * This file contains unit tests for the PrivateRoute component using React Testing Library and Jest.
 * It includes tests to ensure the component renders children if the user has an allowed role,
 * redirects to an unauthorized page if the user does not have an allowed role,
 * and redirects to an unauthorized page if the user is not authenticated.
 * 
 * - Renders children if user has an allowed role: Verifies that the component renders its children when the user has the correct role.
 * - Redirects to unauthorized if user does not have an allowed role: Ensures the component redirects to the unauthorized page when the user lacks the correct role.
 * - Redirects to unauthorized if user is not authenticated: Ensures the component redirects to the unauthorized page when the user is not authenticated.
 */

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('PrivateRoute Component', () => {
  const mockUser = {
    role: 'user',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children if user has an allowed role', () => {
    useAuth.mockReturnValue({ user: mockUser });
    render(
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute allowedRoles={['user']}><div>Protected Content</div></PrivateRoute>} />
        </Routes>
      </Router>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to unauthorized if user does not have an allowed role', () => {
    useAuth.mockReturnValue({ user: mockUser });
    render(
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute allowedRoles={['admin']}><div>Protected Content</div></PrivateRoute>} />
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        </Routes>
      </Router>
    );

    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
  });

  test('redirects to unauthorized if user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null });
    render(
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute allowedRoles={['user']}><div>Protected Content</div></PrivateRoute>} />
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        </Routes>
      </Router>
    );

    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
  });
});
