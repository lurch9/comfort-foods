import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getEnv } from '../../utils/env';
import Return from '../../pages/Return';
/**
 * Unit tests for Return Component
 * 
 * This file contains unit tests for the Return component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles loading states, 
 * fetches orders and navigates to order confirmation, handles missing session ID errors, 
 * and manages order fetch errors.
 * 
 * - Renders loading state initially: Ensures the Return component shows a loading state initially.
 * - Fetches order and navigates to order confirmation: Verifies that the component fetches the order and 
 *  - navigates to the order confirmation page.
 * - Handles missing session ID error: Ensures the component handles errors when the session ID is missing.
 * - Handles order fetch error: Verifies that the component displays an error message when fetching the order fails.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 * - ../context/CartContext: Mocked to control the state of the cart during tests.
 * - ../utils/env: Mocked to manage environment variables during tests.
 * - react-router-dom: Mocked to control navigation during tests.
 */

jest.mock('axios');
jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Return Component', () => {
  const API_BASE_URL = 'http://localhost:5000';
  const mockNavigate = jest.fn();
  const mockClearCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getEnv.mockImplementation((key) => {
      if (key === 'VITE_API_BASE_URL') {
        return API_BASE_URL;
      }
      return undefined;
    });

    useCart.mockReturnValue({
      clearCart: mockClearCart,
    });

    useNavigate.mockImplementation(() => mockNavigate);

    // Mock URLSearchParams
    global.URLSearchParams = jest.fn(() => ({
      get: jest.fn().mockReturnValue('test-session-id'),
    }));
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/return?session_id=test-session-id']}>
        <Routes>
          <Route path="/return" element={<Return />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches order and navigates to order confirmation', async () => {
    const mockOrder = { _id: 'test-order-id' };
    axios.get.mockResolvedValue({ data: mockOrder });

    renderComponent();

    await waitFor(() => {
      expect(mockClearCart).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(`/order-confirmation/test-order-id`);
    });
  });

  test('handles missing session ID error', async () => {
    global.URLSearchParams = jest.fn(() => ({
      get: jest.fn().mockReturnValue(null),
    }));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Error: No session ID found')).toBeInTheDocument();
    });
  });

  test('handles order fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Fetch failed'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch order details')).toBeInTheDocument();
    });
  });
});
