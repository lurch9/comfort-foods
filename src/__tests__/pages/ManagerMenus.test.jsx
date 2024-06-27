import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ManagerMenus from '../../pages/ManagerMenus';
import { getEnv } from '../../utils/env';
/**
 * Unit tests for ManagerMenus Component
 * 
 * This file contains unit tests for the ManagerMenus component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles loading states, fetches and displays menus,
 * handles scenarios where no menus are present, displays error messages on fetch errors, handles menu deletion, and handles delete cancellation.
 * 
 * - Renders loading state initially: Ensures the ManagerMenus component shows a loading state initially.
 * - Fetches and displays menus: Verifies that the component fetches and correctly displays the menus.
 * - Handles no menus scenario: Ensures the component correctly handles scenarios where no menus are present.
 * - Displays error message on fetch error: Ensures the component displays an error message if fetching menus fails.
 * - Handles menu deletion: Verifies that the component can handle the deletion of a menu.
 * - Handles delete cancellation: Ensures the component can handle the cancellation of a menu deletion.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 * - ../context/AuthContext: Mocked to control authentication state during tests.
 * - react-router-dom: Mocked to control navigation during tests.
 * - ../utils/env: Mocked to manage environment variables during tests.
 */

jest.mock('axios');
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));

describe('ManagerMenus Component', () => {
  const mockUser = {
    token: 'fake-token',
    restaurantId: 'restaurant1',
  };

  const mockMenus = [
    { _id: 'menu1', name: 'Breakfast Menu' },
    { _id: 'menu2', name: 'Lunch Menu' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders loading state initially', async () => {
    axios.get.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    await act(async () => {
      render(<ManagerMenus />);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays menus', async () => {
    axios.get.mockResolvedValue({ data: mockMenus });

    await act(async () => {
      render(<ManagerMenus />);
    });

    await waitFor(() => {
      expect(screen.getByText('Manage Menus')).toBeInTheDocument();
      expect(screen.getByText('Breakfast Menu')).toBeInTheDocument();
      expect(screen.getByText('Lunch Menu')).toBeInTheDocument();
    });
  });

  test('handles no menus scenario', async () => {
    axios.get.mockResolvedValue({ data: [] });

    await act(async () => {
      render(<ManagerMenus />);
    });

    await waitFor(() => {
      expect(screen.getByText('You currently have no menus.')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch error', async () => {
    axios.get.mockRejectedValue({
      response: { data: { message: 'Fetch failed' } },
    });

    await act(async () => {
      render(<ManagerMenus />);
    });

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument();
    });
  });

  test('handles menu deletion', async () => {
    axios.get.mockResolvedValue({ data: mockMenus });
    axios.delete.mockResolvedValue({});

    window.confirm = jest.fn(() => true); // Mock window.confirm to always return true

    await act(async () => {
      render(<ManagerMenus />);
    });

    await waitFor(() => {
      expect(screen.getByText('Breakfast Menu')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete Menu');
    fireEvent.click(deleteButtons[0]); // Click the first Delete Menu button

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'undefined/api/menus/menu1',
        expect.any(Object)
      );
      expect(screen.queryByText('Breakfast Menu')).not.toBeInTheDocument();
    });
  });

  test('handles delete cancellation', async () => {
    axios.get.mockResolvedValue({ data: mockMenus });

    window.confirm = jest.fn(() => false); // Mock window.confirm to always return false

    await act(async () => {
      render(<ManagerMenus />);
    });

    await waitFor(() => {
      expect(screen.getByText('Breakfast Menu')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete Menu');
    fireEvent.click(deleteButtons[0]); // Click the first Delete Menu button

    await waitFor(() => {
      expect(screen.getByText('Breakfast Menu')).toBeInTheDocument();
    });
  });
});
