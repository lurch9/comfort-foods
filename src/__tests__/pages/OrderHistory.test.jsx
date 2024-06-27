import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderHistory from '../../pages/OrderHistory';
import { getEnv } from '../../utils/env';
/**
 * Unit tests for OrderHistory Component
 * 
 * This file contains unit tests for the OrderHistory component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles data fetching successfully,
 * and displays error messages on fetching failure.
 * 
 * - Renders OrderHistory: Verifies the component is rendered correctly with initial loading state.
 * - Fetches order history successfully: Mocks an API call to fetch order history and checks that the orders are displayed.
 * - Handles fetching error: Mocks an API error response and checks that the error message is displayed.
 */

jest.mock('axios');
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));

describe('OrderHistory Component', () => {
  const API_BASE_URL = 'http://localhost:5000';

  const mockOrders = [
    {
      _id: 'order1',
      total: 100,
      status: 'completed',
      items: [
        { product: 'item1', name: 'Item 1', price: 50, quantity: 1 },
        { product: 'item2', name: 'Item 2', price: 25, quantity: 2 },
      ],
    },
    {
      _id: 'order2',
      total: 200,
      status: 'pending',
      items: [
        { product: 'item3', name: 'Item 3', price: 100, quantity: 2 },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: { token: 'fake-token' } });
    getEnv.mockImplementation((key) => {
      if (key === 'VITE_API_BASE_URL') {
        return API_BASE_URL;
      }
      return undefined;
    });
  });

  test('renders loading state initially', async () => {
    axios.get.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    await act(async () => {
      render(
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays order history', async () => {
    axios.get.mockResolvedValue({ data: mockOrders });

    await act(async () => {
      render(
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Order History')).toBeInTheDocument();
      expect(screen.getByText('Order #order1')).toBeInTheDocument();
      expect(screen.getByText('Order #order2')).toBeInTheDocument();
      expect(screen.getByText('Total: $100.00')).toBeInTheDocument();
      expect(screen.getByText('Total: $200.00')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Fetch failed'));

    await act(async () => {
      render(
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument();
    });
  });

  test('displays "You have no past orders" message when there are no orders', async () => {
    axios.get.mockResolvedValue({ data: [] });

    await act(async () => {
      render(
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('You have no past orders.')).toBeInTheDocument();
    });
  });
});

