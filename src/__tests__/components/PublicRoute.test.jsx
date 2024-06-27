import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PublicRoute from '../../components/PublicRoute';
/**
 * Unit tests for PublicRoute Component
 * 
 * This file contains unit tests for the PublicRoute component using React Testing Library and Jest.
 * It includes tests to ensure the component renders its children if the user is not logged in,
 * renders its children if the user is a guest, and redirects to the user dashboard if the user is logged in and not a guest.
 * 
 * - Renders children if user is not logged in: Verifies that the component renders its children when the user is not logged in.
 * - Renders children if user is a guest: Ensures the component renders its children when the user is a guest.
 * - Redirects to user dashboard if user is logged in and not a guest: Ensures the component redirects to the user dashboard when the user is logged in and not a guest.
 */
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('PublicRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children if user is not logged in', () => {
    useAuth.mockReturnValue({ user: null });
    render(
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><div>Public Content</div></PublicRoute>} />
        </Routes>
      </Router>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  test('renders children if user is a guest', () => {
    useAuth.mockReturnValue({ user: { role: 'guest' } });
    render(
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><div>Public Content</div></PublicRoute>} />
        </Routes>
      </Router>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  test('redirects to user dashboard if user is logged in and not a guest', () => {
    useAuth.mockReturnValue({ user: { role: 'user' } });
    render(
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><div>Public Content</div></PublicRoute>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </Router>
    );

    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
