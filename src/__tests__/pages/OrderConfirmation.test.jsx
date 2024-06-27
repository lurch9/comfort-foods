import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import OrderConfirmation from '../../pages/OrderConfirmation';
import { getEnv } from '../../utils/env';
/**
 * Unit tests for OrderConfirmation Component
 * 
 * This file contains unit tests for the OrderConfirmation component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles loading states, fetches and displays order details,
 * displays error messages on fetch errors, and updates order status via WebSocket.
 * 
 * - Renders loading state initially: Ensures the OrderConfirmation component shows a loading state initially.
 * - Fetches and displays order details: Verifies that the component fetches and correctly displays the order details.
 * - Displays error message on fetch error: Ensures the component displays an error message if fetching order details fails.
 * - Updates order status via WebSocket: Verifies that the component can update the order status in real-time using WebSocket.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 * - socket.io-client: Mocked to avoid actual WebSocket connections during testing.
 * - react-router-dom: Mocked to control navigation during tests.
 * - ../utils/env: Mocked to manage environment variables during tests.
 */

jest.mock('axios');
jest.mock('socket.io-client');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));

describe('OrderConfirmation Component', () => {
  const API_BASE_URL = 'http://localhost:5000';

  const mockOrder = {
    _id: 'order1',
    total: 100,
    items: [
      { name: 'Item 1', price: 50, quantity: 1 },
      { name: 'Item 2', price: 25, quantity: 2 },
    ],
    status: 'pending',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: 'order1' });
    getEnv.mockImplementation((key) => {
      if (key === 'VITE_API_BASE_URL') {
        return API_BASE_URL;
      }
      return undefined;
    });

    const socketOn = jest.fn();
    const socketDisconnect = jest.fn();
    io.mockReturnValue({ on: socketOn, disconnect: socketDisconnect });

    // Log socket mock to verify setup
    console.log('Mock socket setup:', io());
  });

  test('renders loading state initially', async () => {
    axios.get.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    await act(async () => {
      render(<OrderConfirmation />);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays order details', async () => {
    axios.get.mockResolvedValue({ data: mockOrder });

    await act(async () => {
      render(<OrderConfirmation />);
    });

    await waitFor(() => {
      expect(screen.getByText('Order Confirmation')).toBeInTheDocument();
      expect(screen.getByText('Order ID: order1')).toBeInTheDocument();
      expect(screen.getByText('Total: $100')).toBeInTheDocument();
      expect(screen.getByText('Item 1 - $50 x 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2 - $25 x 2')).toBeInTheDocument();
      expect(screen.getByText('Status: pending')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Fetch failed'));

    await act(async () => {
      render(<OrderConfirmation />);
    });

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch order details')).toBeInTheDocument();
    });
  });

  test('updates order status via WebSocket', async () => {
    axios.get.mockResolvedValue({ data: mockOrder });
    const socketOn = jest.fn();
    const socketDisconnect = jest.fn();
    io.mockReturnValue({ on: socketOn, disconnect: socketDisconnect });

    const { unmount } = render(<OrderConfirmation />);

    await waitFor(() => {
      expect(screen.getByText('Status: pending')).toBeInTheDocument();
    });

    const statusUpdate = { orderId: 'order1', status: 'completed' };
    socketOn.mock.calls[0][1](statusUpdate);

    await waitFor(() => {
      expect(screen.getByText('Status: completed')).toBeInTheDocument();
    });

    unmount(); // Ensure the component unmounts to trigger the cleanup function

    expect(socketDisconnect).toHaveBeenCalled();
  });
});
