import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CompletedOrders from '../../components/CompletedOrders';
/**
 * Unit tests for CompletedOrders Component
 * 
 * This file contains unit tests for the CompletedOrders component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles data fetching successfully,
 * handles order status updates, and displays error messages on fetching or updating failure.
 * 
 * - Renders loading state initially: Verifies the component displays a loading state initially.
 * - Fetches and displays the orders: Mocks an API call to fetch completed orders and checks that the orders are displayed.
 * - Handles order status update: Mocks an API call to update the order status and checks that the order status is updated correctly.
 * - Displays error message on fetch error: Mocks an API error response for fetching orders and checks that the error message is displayed.
 * - Displays error message on status update error: Mocks an API error response for updating order status and checks that the error message is displayed.
 */

jest.mock('axios');
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the environment variables
beforeAll(() => {
  process.env.VITE_API_BASE_URL = 'http://localhost:5000';
});

afterAll(() => {
  // Clean up the mock environment variables
  delete process.env.VITE_API_BASE_URL;
});

describe('CompletedOrders Component', () => {
  const mockOrders = [
    {
      _id: 'order1',
      status: 'completed',
      total: 100,
      createdAt: '2023-06-20T00:00:00Z',
      items: [
        { name: 'Item 1', quantity: 1, price: 50 },
        { name: 'Item 2', quantity: 2, price: 25 },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    useAuth.mockReturnValue({
      user: { token: 'fake-token' },
    });

    axios.get.mockResolvedValue({ data: mockOrders });
    axios.put.mockResolvedValue({});
  });

  test('renders loading state initially', async () => {
    // Introduce a delay in the mocked axios.get call
    axios.get.mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ data: mockOrders }), 100)
      )
    );

    await act(async () => {
      render(<CompletedOrders restaurantId="restaurant1" />);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays the orders', async () => {
    await act(async () => {
      render(<CompletedOrders restaurantId="restaurant1" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Order #order1')).toBeInTheDocument();
      expect(screen.getByText('Status: completed')).toBeInTheDocument();
      expect(screen.getByText('Total: $100')).toBeInTheDocument();
      expect(screen.getByText('Ordered at: 6/19/2023')).toBeInTheDocument();
      expect(screen.getByText('1 x Item 1 - $50')).toBeInTheDocument();
      expect(screen.getByText('2 x Item 2 - $25')).toBeInTheDocument();
    });
  });

  test('handles order status update', async () => {
    await act(async () => {
      render(<CompletedOrders restaurantId="restaurant1" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Order #order1')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByText('Prepare'));
    });

    await waitFor(() => {
      expect(screen.getByText('Status: preparing')).toBeInTheDocument();
    });

    expect(axios.put).toHaveBeenCalledWith(
      'http://localhost:5000/api/orders/order1/status',
      { status: 'preparing' },
      expect.any(Object)
    );
  });

  test('displays error message on fetch error', async () => {
    axios.get.mockRejectedValue({ response: { data: { message: 'Fetch failed' } } });

    await act(async () => {
      render(<CompletedOrders restaurantId="restaurant1" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument();
    });
  });

  test('displays error message on status update error', async () => {
    axios.put.mockRejectedValue({ response: { data: { message: 'Update failed' } } });

    await act(async () => {
      render(<CompletedOrders restaurantId="restaurant1" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Order #order1')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByText('Prepare'));
    });

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });
});

