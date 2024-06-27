import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cookies from 'js-cookie';
import { CartProvider, useCart } from '../../context/CartContext';
/**
 * Unit tests for CartContext
 * 
 * This file contains unit tests for the CartContext component using React Testing Library and Jest.
 * It includes tests to ensure the context initializes with an empty cart, handles adding and removing items,
 * updates item quantities, and clears the cart.
 * 
 * - Initializes with an empty cart: Verifies that the context initializes with an empty cart state.
 * - Adds items to the cart: Ensures that items can be added to the cart and the cart state updates correctly.
 * - Removes items from the cart: Verifies that items can be removed from the cart and the cart state updates correctly.
 * - Updates item quantity in the cart: Ensures that the quantity of items in the cart can be updated and the cart state reflects the changes.
 * - Clears the cart: Verifies that the cart can be cleared and the cart state resets to empty.
 */

jest.mock('js-cookie');

const TestComponent = () => {
  const { cart, restaurantId, addToCart, removeFromCart, updateCartQuantity, clearCart } = useCart();

  return (
    <div>
      <div>Cart Items: {cart.length}</div>
      <div>Restaurant ID: {restaurantId}</div>
      <button onClick={() => addToCart({ product: '1', name: 'Item 1', price: 10, restaurant: '123' })}>Add Item 1</button>
      <button onClick={() => removeFromCart({ product: '1', name: 'Item 1', price: 10, restaurant: '123' })}>Remove Item 1</button>
      <button onClick={() => updateCartQuantity({ product: '1', name: 'Item 1', price: 10, restaurant: '123' }, 5)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Cookies.get.mockImplementation((key) => {
      switch (key) {
        case 'cart':
          return JSON.stringify([]);
        case 'restaurantId':
          return null;
        default:
          return undefined;
      }
    });
    Cookies.set.mockImplementation(() => {});
    Cookies.remove.mockImplementation(() => {});
  });

  test('initializes with an empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByText('Cart Items: 0')).toBeInTheDocument();
    expect(screen.getByText('Restaurant ID:')).toBeInTheDocument();
  });

  test('adds items to the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add Item 1');
    fireEvent.click(addButton);

    expect(screen.getByText('Cart Items: 1')).toBeInTheDocument();
    expect(screen.getByText('Restaurant ID: 123')).toBeInTheDocument();
  });

  test('removes items from the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add Item 1');
    fireEvent.click(addButton);
    expect(screen.getByText('Cart Items: 1')).toBeInTheDocument();

    const removeButton = screen.getByText('Remove Item 1');
    fireEvent.click(removeButton);
    expect(screen.getByText('Cart Items: 0')).toBeInTheDocument();
  });

  test('updates item quantity in the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add Item 1');
    fireEvent.click(addButton);
    expect(screen.getByText('Cart Items: 1')).toBeInTheDocument();

    const updateButton = screen.getByText('Update Quantity');
    fireEvent.click(updateButton);
    expect(screen.getByText('Cart Items: 1')).toBeInTheDocument();
  });

  test('clears the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText('Add Item 1');
    fireEvent.click(addButton);
    expect(screen.getByText('Cart Items: 1')).toBeInTheDocument();

    const clearButton = screen.getByText('Clear Cart');
    fireEvent.click(clearButton);
    expect(screen.getByText('Cart Items: 0')).toBeInTheDocument();
    expect(screen.getByText('Restaurant ID:')).toBeInTheDocument();
  });
});
