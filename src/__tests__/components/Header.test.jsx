import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
/**
 * Unit tests for Header Component
 * 
 * This file contains unit tests for the Header component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, toggles the menu, closes the menu when clicking outside,
 * displays the correct links based on user role, shows the cart icon with the correct item count, 
 * and displays login and register links for guest users.
 * 
 * - Renders the Header component: Ensures the Header component renders correctly without crashing.
 * - Toggles the menu: Checks if the menu opens and closes correctly when the toggle button is clicked.
 * - Closes the menu when clicking outside: Verifies that the menu closes when a click is detected outside of the menu.
 * - Displays the correct links based on user role: Tests that the Header displays appropriate navigation links based on user role.
 * - Displays the cart icon with the correct item count: Ensures the cart icon shows the correct number of items.
 * - Displays login and register links for guest users: Verifies that login and register links are shown when the user is not logged in.
 */

// Mock FontAwesomeIcon to avoid rendering issues
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span />,
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

describe('Header Component', () => {
  const mockLogout = jest.fn();
  const mockUser = {
    role: 'user',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    useCart.mockReturnValue({ cart: [{ quantity: 2 }, { quantity: 3 }] });
  });

  test('renders the Header component', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText('Comfort Foods')).toBeInTheDocument();
  });

  test('toggles the menu', () => {
    const { container } = render(
      <Router>
        <Header />
      </Router>
    );

    const menuIcon = container.querySelector('.menu-icon');
    fireEvent.click(menuIcon);
    expect(screen.getByRole('navigation')).toHaveClass('open');
  });

  test('closes the menu when clicking outside', async () => {
    const { container } = render(
      <Router>
        <Header />
      </Router>
    );

    const menuIcon = container.querySelector('.menu-icon');
    fireEvent.click(menuIcon);
    expect(screen.getByRole('navigation')).toHaveClass('open');

    fireEvent.mouseDown(document);
    await waitFor(() => {
      expect(screen.getByRole('navigation')).not.toHaveClass('open');
    });
  });

  test('displays the correct links based on user role', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('displays the cart icon with correct item count', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('displays login and register links for guest users', () => {
    useAuth.mockReturnValue({ user: { role: 'guest' }, logout: mockLogout });
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});

