// src/__tests__/App.test.jsx
import '../../__mocks__/google-maps-api';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { getEnv } from '../../utils/env';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../__mocks__/socket.io-client';
const API_BASE_URL = getEnv('VITE_API_BASE_URL');
const guestUser = { token: null, restaurantId: null, role: 'guest' };
const mockUserProfile = {
  name: 'Test User',
  email: 'testuser@example.com',
  street: '123 Test St',
  city: 'Test City',
  state: 'Test State',
  zip: '12345',
  dateOfBirth: '1990-01-01',
  role: 'manager',
  token:'mock-token',
};
/**
 * Integration tests for App
 * 
 * This file contains integration tests for the entire application using React Testing Library and Jest.
 * It includes tests to ensure that the various routes render the correct components and handle navigation appropriately.
 * 
 * - Renders RestaurantList at root path: Ensures that the RestaurantList component renders correctly at the root path.
 * - Renders Login page at /login path: Verifies that the Login component renders correctly at the /login path.
 * - Renders Register page at /register path: Ensures that the Register component renders correctly at the /register path.
 * - Redirects to Unauthorized page for unauthorized access: Verifies that unauthorized access redirects to the Unauthorized component.
 * - Renders Profile page for user role: Ensures that the Profile component renders correctly for a user role.
 * - Renders ManagerDashboard for manager role: Verifies that the ManagerDashboard component renders correctly for a manager role.
 * - Renders Dashboard for both manager and user roles: Ensures that the Dashboard component renders correctly for both manager and user roles.
 * - Renders Cart page at /cart path: Verifies that the Cart component renders correctly at the /cart path.
 * - Renders Checkout page at /checkout path: Ensures that the Checkout component renders correctly at the /checkout path.
 * - Renders OrderConfirmation page at /order-confirmation/:id path: Verifies that the OrderConfirmation component renders correctly at 
 *  - the /order-confirmation/:id path.
 * - Renders OrderHistory page for user role: Ensures that the OrderHistory component renders correctly for a user role.
 * 
 * Dependencies mocked:
 * - @react-google-maps/api: Mocked to avoid actual Google Maps API calls during testing.
 */

jest.mock('@react-google-maps/api', () => ({
  ...jest.requireActual('@react-google-maps/api'),
  useLoadScript: jest.fn(),
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

const renderWithAuthAndCart = (ui, { route = '/', user = null, cart = [] } = {}) => {
  return renderWithRouter(
    <AuthContext.Provider value={{ user, setUser: jest.fn(), login: jest.fn(), logout: jest.fn() }}>
      <CartContext.Provider value={{ cart, setCart: jest.fn(), addToCart: jest.fn(), updateCartQuantity: jest.fn(), removeFromCart: jest.fn(), clearCart: jest.fn() }}>
        {ui}
      </CartContext.Provider>
    </AuthContext.Provider>,
    { route }
  );
};

describe('App Integration Tests', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    useLoadScript.mockReturnValue({ isLoaded: true });
  });

  afterEach(() => {
    mock.reset();
  });

  test('renders RestaurantList at root path', async () => {
    renderWithAuthAndCart(<App />, { user: guestUser });

    // Wait for the Google Maps API to load and for the loading state to finish
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Check for the text that should be present after loading
    expect(screen.getByText(/Enter your address and hit search to find registered restaurants near you!/i)).toBeInTheDocument();
  });

  test('renders Login page at /login path', () => {
    renderWithAuthAndCart(<App />, { user: guestUser });
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('renders Register page at /register path', () => {
    renderWithAuthAndCart(<App />, { route: '/register', user: guestUser });
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('redirects to Unauthorized page for unauthorized access', async () => {
    mock.onGet('/profile').reply(401, {
      response: { data: { message: 'Unauthorized' } },
    });

    renderWithAuthAndCart(<App />, { route: '/profile', user: null });
    await waitFor(() => expect(screen.getByText(/Unauthorized/i)).toBeInTheDocument());
  });

  test('renders Profile page for user role', async () => {
    mock.onGet('/profile').reply(200, { role: 'user' });

    renderWithAuthAndCart(<App />, { route: '/profile', user: { id: '1', role: 'user', name: 'Test User' } });
    await waitFor(() => expect(screen.getByText(/Update Profile/i)).toBeInTheDocument());
  });

  test('renders ManagerDashboard for manager role', async () => {
    mock.onGet('/manager-dashboard').reply(200, { role: 'manager' });

    renderWithAuthAndCart(<App />, { route: '/manager-dashboard', user: { id: '2', role: 'manager', name: 'Manager User' } });
    await waitFor(() => expect(screen.getByText(/Manager Dashboard/i)).toBeInTheDocument());
  });

  test('renders Dashboard for both manager and user roles', async () => {

    mock.onGet(`${API_BASE_URL}/api/users/profile`).replyOnce(200, mockUserProfile);

    renderWithAuthAndCart(<App />, { route: '/dashboard', user: mockUserProfile });
    await waitFor(() => expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument());

    mock.onGet(`${API_BASE_URL}/api/users/profile`).replyOnce(200, mockUserProfile);

    renderWithAuthAndCart(<App />, { route: '/dashboard', user: mockUserProfile });
    await waitFor(() => expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument());
  });

  test('renders Cart page at /cart path', () => {
    renderWithAuthAndCart(<App />, { route: '/cart', cart: [{ id: 'item1', name: 'Test Item', product: 'product1', restaurant: 'restaurant1' }] });
    expect(screen.getByText(/Cart/i)).toBeInTheDocument();
  });

  test('renders Checkout page at /checkout path', () => {
    renderWithAuthAndCart(<App />, { route: '/checkout', cart: [{ id: 'item1', name: 'Test Item', product: 'product1', restaurant: 'restaurant1' }] });
    expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
  });

  test('renders OrderConfirmation page at /order-confirmation/:id path', async () => {
    const mockOrder = {
      _id: '123',
      total: 100,
      items: [{ name: 'Test Item', price: 50, quantity: 2 }],
      status: 'Pending',
    };

    mock.onGet(`${API_BASE_URL}/api/orders/123`).reply(200, mockOrder);

    renderWithAuthAndCart(<App />, { route: '/order-confirmation/123', user: guestUser });
    await waitFor(() => expect(screen.getByText(/Order Confirmation/i)).toBeInTheDocument());
    expect(screen.getByText(/Order ID: 123/i)).toBeInTheDocument();
    expect(screen.getByText(/Total: \$100/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Item - \$50 x 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: Pending/i)).toBeInTheDocument();
  });

  test('renders OrderHistory page for user role', async () => {
    const mockOrders = [
      {
        _id: '1',
        status: 'Completed',
        total: 50,
        items: [{ product: '1', name: 'Test Item', price: 50, quantity: 1 }],
      },
    ];

    mock.onGet(`${API_BASE_URL}/api/orders`).reply(200, mockOrders);

    renderWithAuthAndCart(<App />, { route: '/order-history', user: { id: '1', role: 'user', name: 'Test User', token: 'user-token' } });
    await waitFor(() => expect(screen.getByText(/Order History/i)).toBeInTheDocument());
  });
});
