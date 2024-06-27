import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RestaurantMenu from '../../pages/RestaurantMenu';
import { useCart } from '../../context/CartContext';
import { getEnv } from '../../utils/env';
/**
 * Unit tests for RestaurantMenu Component
 * 
 * This file contains unit tests for the RestaurantMenu component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles loading states, fetches and displays menu items,
 * displays error messages on fetch errors, shows messages when no menu items are found, and adds items to the cart.
 * 
 * - Renders loading state initially: Ensures the RestaurantMenu component shows a loading state initially.
 * - Fetches and displays menu items: Verifies that the component fetches and correctly displays menu items.
 * - Displays error message on fetch error: Ensures the component displays an error message if fetching menu items fails.
 * - Displays message when no menu items are found: Verifies that the component displays a message when no menu items are found.
 * - Adds item to cart when "Add to Cart" button is clicked: Ensures that the component adds an item to the cart when the "Add to Cart" button is clicked.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 * - ../context/CartContext: Mocked to control the state of the cart during tests.
 * - ../utils/env: Mocked to manage environment variables during tests.
 */


jest.mock('axios');
jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));

describe('RestaurantMenu Component', () => {
  const API_BASE_URL = 'http://localhost:5000';
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getEnv.mockImplementation((key) => {
      if (key === 'VITE_API_BASE_URL') {
        return API_BASE_URL;
      }
      return undefined;
    });

    useCart.mockReturnValue({
      addToCart: mockAddToCart,
    });
  });

  const renderComponent = (restaurantId) => {
    return render(
      <MemoryRouter initialEntries={[`/restaurant/${restaurantId}/menu`]}>
        <Routes>
          <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenu />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Mocking a pending promise

    renderComponent('restaurant1');

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays menu items', async () => {
    const mockMenus = [
      {
        _id: 'menu1',
        name: 'Main Menu',
        items: [
          {
            _id: 'item1',
            name: 'Burger',
            description: 'Juicy grilled burger',
            price: 9.99,
          },
          {
            _id: 'item2',
            name: 'Fries',
            description: 'Crispy fries',
            price: 3.49,
          },
        ],
      },
    ];

    axios.get.mockResolvedValue({ data: mockMenus });

    renderComponent('restaurant1');

    await waitFor(() => expect(screen.getByText('Main Menu')).toBeInTheDocument());
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Juicy grilled burger')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('Fries')).toBeInTheDocument();
    expect(screen.getByText('Crispy fries')).toBeInTheDocument();
    expect(screen.getByText('$3.49')).toBeInTheDocument();
  });

  test('displays error message on fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Fetch failed'));

    renderComponent('restaurant1');

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument();
    });
  });

  test('displays message when no menu items are found', async () => {
    const mockMenus = [
      {
        _id: 'menu1',
        name: 'Main Menu',
        items: [],
      },
    ];

    axios.get.mockResolvedValue({ data: mockMenus });

    renderComponent('restaurant1');

    await waitFor(() => expect(screen.getByText('Main Menu')).toBeInTheDocument());
    expect(screen.getByText('No items in this menu.')).toBeInTheDocument();
  });

  test('adds item to cart when "Add to Cart" button is clicked', async () => {
    const mockMenus = [
      {
        _id: 'menu1',
        name: 'Main Menu',
        items: [
          {
            _id: 'item1',
            name: 'Burger',
            description: 'Juicy grilled burger',
            price: 9.99,
          },
        ],
      },
    ];

    axios.get.mockResolvedValue({ data: mockMenus });

    renderComponent('restaurant1');

    await waitFor(() => expect(screen.getByText('Burger')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Add to Cart'));

    expect(mockAddToCart).toHaveBeenCalledWith({
      product: 'item1',
      name: 'Burger',
      description: 'Juicy grilled burger',
      price: 9.99,
      restaurant: 'restaurant1',
    });
  });
});
