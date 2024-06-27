import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEnv } from '../../utils/env';
import ManagerDashboard from '../../pages/ManagerDashboard';
import CompletedOrders from '../../components/CompletedOrders';
/**
 * Unit tests for ManagerDashboard Component
 * 
 * This file contains unit tests for the ManagerDashboard component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles loading states, fetches and displays restaurant and order data,
 * handles restaurant creation, updates order status, toggles completed orders, deletes a restaurant, and displays error messages on fetch errors.
 * 
 * - Renders loading state initially: Ensures the ManagerDashboard component shows a loading state initially.
 * - Fetches and displays restaurant and orders: Verifies that the component fetches and correctly displays the restaurant and order data.
 * - Handles restaurant creation: Ensures the component can handle the creation of a new restaurant.
 * - Handles order status update: Verifies that the component can handle updates to the order status.
 * - Handles completed orders toggle: Ensures the component can toggle the display of completed orders.
 * - Handles delete restaurant: Verifies that the component can handle the deletion of a restaurant.
 * - Displays error message on fetch error: Ensures the component displays an error message if fetching data fails.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 * - react-router-dom: Mocked to control navigation during tests.
 * - ../context/AuthContext: Mocked to control authentication state during tests.
 * - ../utils/env: Mocked to manage environment variables during tests.
 * - ../components/CompletedOrders: Mocked to control the CompletedOrders component during tests.
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
jest.mock('../../components/CompletedOrders', () => jest.fn(() => <div>Completed Orders</div>));

describe('ManagerDashboard Component', () => {
  const mockUser = {
    token: 'fake-token',
    restaurantId: 'restaurant1',
  };

  const mockRestaurant = {
    _id: 'restaurant1',
    name: 'Test Restaurant',
    address: {
      street: '123 Main St',
      city: 'Test City',
      state: 'TS',
      zip: '12345',
    },
    contact: '123-456-7890',
  };

  const mockOrders = [
    {
      _id: 'order1',
      status: 'new',
      total: 100,
      createdAt: '2023-06-19T00:00:00Z',
      items: [
        { name: 'Item 1', quantity: 1, price: 50 },
        { name: 'Item 2', quantity: 2, price: 25 },
      ],
    },
  ];

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
      user: mockUser,
      setUser: jest.fn(),
    });

    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders loading state initially', async () => {
    axios.get.mockImplementation((url) =>
      new Promise((resolve) =>
        setTimeout(() => {
          if (url.includes('/api/restaurants/me')) {
            resolve({ data: mockRestaurant });
          } else if (url.includes('/api/orders/restaurant')) {
            resolve({ data: mockOrders });
          }
        }, 100)
      )
    );

    await act(async () => {
      render(<ManagerDashboard />);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays restaurant and orders', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurant });
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    await act(async () => {
      render(<ManagerDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Restaurant Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Restaurant Name: Test Restaurant')).toBeInTheDocument();
      expect(screen.getByText('Address: 123 Main St, Test City, TS, 12345')).toBeInTheDocument();
      expect(screen.getByText('Contact: 123-456-7890')).toBeInTheDocument();
      expect(screen.getByText('Order #order1')).toBeInTheDocument();
    });
  });

  test('handles restaurant creation', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });
    axios.post.mockResolvedValueOnce({ data: mockRestaurant });

    await act(async () => {
      render(<ManagerDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('No restaurant found. Please create one.')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Restaurant Name'), { target: { value: 'Test Restaurant' } });
    fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'TS' } });
    fireEvent.change(screen.getByPlaceholderText('ZIP Code'), { target: { value: '12345' } });
    fireEvent.change(screen.getByPlaceholderText('Contact'), { target: { value: '123-456-7890' } });

    fireEvent.submit(screen.getByText('Create Restaurant'));

    await waitFor(() => {
      expect(screen.getByText('Restaurant Name: Test Restaurant')).toBeInTheDocument();
    });
  });

  test('handles order status update', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurant });
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    axios.put.mockResolvedValueOnce({});

    await act(async () => {
      render(<ManagerDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Order #order1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Accept'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'undefined/api/orders/order1/status',
        { status: 'accepted' },
        expect.any(Object)
      );
    });
  });

  test('handles completed orders toggle', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurant });
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    await act(async () => {
      render(<ManagerDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Order #order1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Show Completed Orders'));

    await waitFor(() => {
      expect(screen.getByText('Completed Orders')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Hide Completed Orders'));

    await waitFor(() => {
      expect(screen.queryByText('Completed Orders')).not.toBeInTheDocument();
    });
  });

  test('handles delete restaurant', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurant });
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    axios.delete.mockResolvedValueOnce({});

    window.confirm = jest.fn(() => true); // Mock window.confirm to always return true

    await act(async () => {
      render(<ManagerDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Restaurant Name: Test Restaurant')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete Restaurant'));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'undefined/api/restaurants/restaurant1',
        expect.any(Object)
      );
      expect(screen.getByText('No restaurant found. Please create one.')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch error', async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { message: 'Fetch failed' } } });

    await act(async () => {
      render(<ManagerDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument();
    });
  });
});
