import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Unauthorized from '../../pages/Unauthorized';
/**
 * Unit tests for Unauthorized Component
 * 
 * This file contains unit tests for the Unauthorized component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly and displays the appropriate messages and links.
 * 
 * - Renders Unauthorized message: Ensures the Unauthorized component displays the unauthorized message correctly.
 * - Renders links to login and register: Verifies that the component displays links to the login and register pages.
 */

describe('Unauthorized Component', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Unauthorized />
      </MemoryRouter>
    );
  };

  test('renders Unauthorized message', () => {
    renderComponent();

    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
  });

  test('renders links to login and register', () => {
    renderComponent();

    const loginElement = screen.getByRole('link', { name: /Login/i });
    expect(loginElement).toBeInTheDocument();
    expect(loginElement).toHaveAttribute('href', '/login');
    const registerElement = screen.getByRole('link', { name: /Register/i });
    expect(registerElement).toBeInTheDocument();
    expect(registerElement).toHaveAttribute('href', '/register');
  });
});
