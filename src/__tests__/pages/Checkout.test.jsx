import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getEnv } from '../../utils/env';
import Checkout from '../../pages/Checkout';
/**
 * Unit tests for Checkout Component
 * 
 * This file contains unit tests for the Checkout component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, creates a checkout session, and completes the checkout process.
 * 
 * - Renders Checkout component: Ensures the Checkout component renders correctly without crashing.
 * - Creates checkout session and completes checkout: Verifies that the component correctly creates a checkout session and completes the checkout process using mocked Stripe methods.
 * 
 * Dependencies mocked:
 * - @stripe/stripe-js: Mocked to avoid actual calls to Stripe during testing.
 * - @stripe/react-stripe-js: Mocked to integrate with the mocked Stripe methods.
 * - ../context/CartContext: Mocked to control the state of the cart during tests.
 * - ../context/AuthContext: Mocked to control the authentication state during tests.
 * - ../utils/env: Mocked to manage environment variables during tests.
 */

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: jest.fn(({ children }) => <div>{children}</div>),
  EmbeddedCheckoutProvider: jest.fn(({ children, options }) => {
    if (options && options.fetchClientSecret) {
      options.fetchClientSecret();
    }
    return <div>{children}</div>;
  }),
  EmbeddedCheckout: jest.fn(() => <div>Mocked Embedded Checkout</div>),
}));

jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../utils/env', () => ({
  getEnv: jest.fn((key) => {
    switch (key) {
      case 'VITE_API_BASE_URL':
        console.log('Returning API base URL for VITE_API_BASE_URL');
        return 'http://localhost:5000';
      case 'VITE_STRIPE_PUBLISHABLE_KEY':
        console.log('Returning Stripe publishable key for VITE_STRIPE_PUBLISHABLE_KEY');
        return 'pk_test_key';
      default:
        console.log(`Returning default value for ${key}`);
        return '';
    }
  }),
}));

describe('Checkout Component', () => {
  const mockStripe = {
    elements: jest.fn(),
    createToken: jest.fn(),
    createPaymentMethod: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ clientSecret: 'test_client_secret' }));

    getEnv.mockImplementation((key) => {
      switch (key) {
        case 'VITE_API_BASE_URL':
          return 'http://localhost:5000';
        case 'VITE_STRIPE_PUBLISHABLE_KEY':
          return 'pk_test_key';
        default:
          return '';
      }
    });

    useCart.mockReturnValue({
      cart: [{ product: 'item1', name: 'Test Item', price: 1000, restaurant: 'restaurant1' }],
      clearCart: jest.fn(),
    });

    useAuth.mockReturnValue({
      user: { _id: 'user1', name: 'Test User' },
    });

    loadStripe.mockResolvedValue(mockStripe);
  });

  test('renders Checkout component', () => {
    render(<Checkout />);
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Mocked Embedded Checkout')).toBeInTheDocument();
  });

  test('creates checkout session and completes checkout', async () => {
    render(<Checkout />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/create-checkout-session',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{ product: 'item1', name: 'Test Item', price: 1000, restaurant: 'restaurant1' }],
            restaurantId: 'restaurant1',
            customerId: 'user1',
          }),
        })
      );
    });

    // Simulate stripeCheckoutComplete event
    const event = new Event('stripeCheckoutComplete');
    window.dispatchEvent(event);

    await waitFor(() => {
      expect(useCart().clearCart).toHaveBeenCalledTimes(1);
    });

    // Ensure all fetch calls are properly awaited
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
});



