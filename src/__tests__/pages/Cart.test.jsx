import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Cart from '../../pages/Cart';
/**
 * Unit tests for Cart Component
 * 
 * This file contains unit tests for the Cart component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, displays the cart items properly,
 * handles item quantity changes, removes items, and proceeds to checkout.
 * 
 * - Renders the Cart component: Ensures the Cart component renders correctly without crashing.
 * - Displays empty cart message when there are no items: Verifies that the component displays an appropriate message when the cart is empty.
 * - Displays cart items correctly: Ensures that the component correctly displays items present in the cart.
 * - Changes item quantity using dropdown: Verifies that the component handles changes in item quantity using a dropdown.
 * - Changes item quantity using custom input: Ensures that the component handles changes in item quantity using a custom input field.
 * - Removes items from cart: Verifies that the component can remove items from the cart.
 * - Proceeds to checkout: Ensures that the component proceeds to the checkout process correctly.
 */

// Mock useCart hook
jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Cart Component', () => {
  const mockCart = [
    {
      product: '1',
      name: 'Item 1',
      description: 'Description 1',
      price: 10,
      quantity: 1,
      restaurant: '123',
    },
    {
      product: '2',
      name: 'Item 2',
      description: 'Description 2',
      price: 20,
      quantity: 2,
      restaurant: '123',
    },
  ];

  const mockAddToCart = jest.fn();
  const mockRemoveFromCart = jest.fn();
  const mockUpdateCartQuantity = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCart.mockReturnValue({
      cart: mockCart,
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
      updateCartQuantity: mockUpdateCartQuantity,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders the Cart component', () => {
    render(<Cart />);

    expect(screen.getByText('Your Cart')).toBeInTheDocument();
  });

  test('displays empty cart message when there are no items', () => {
    useCart.mockReturnValue({
      cart: [],
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
      updateCartQuantity: mockUpdateCartQuantity,
    });

    render(<Cart />);

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  test('displays cart items correctly', () => {
    render(<Cart />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  test('changes item quantity using dropdown', () => {
    render(<Cart />);

    const quantitySelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(quantitySelect, { target: { value: '2' } });

    expect(mockUpdateCartQuantity).toHaveBeenCalledWith(mockCart[0], 2);
  });

  test('changes item quantity using custom input', () => {
    render(<Cart />);

    const quantitySelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(quantitySelect, { target: { value: '10+' } });

    const customInput = screen.getByDisplayValue('');
    fireEvent.change(customInput, { target: { value: '15' } });
    fireEvent.blur(customInput);

    expect(mockUpdateCartQuantity).toHaveBeenCalledWith(mockCart[0], 15);
  });

  test('removes items from cart', () => {
    render(<Cart />);

    const removeButton = screen.getAllByText('-')[0];
    fireEvent.click(removeButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith(mockCart[0]);
  });

  test('proceeds to checkout', () => {
    render(<Cart />);

    const checkoutButton = screen.getByText('Proceed to Checkout');
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});
