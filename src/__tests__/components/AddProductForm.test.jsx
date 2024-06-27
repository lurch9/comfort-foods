import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
/**
 * Unit tests for AddProductForm Component
 * 
 * This file contains unit tests for the AddProductForm component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles successful form submission,
 * and displays error messages on submission failure.
 * 
 * - Renders AddProductForm: Verifies the form elements are rendered correctly.
 * - Submits form successfully: Mocks an API call to add a product and checks that the form is submitted with the correct data.
 * - Handles submission error: Mocks an API error response and checks that the error message is displayed.
 */

// Mock the getEnv utility
jest.mock('../../utils/env', () => ({
  getEnv: (key) => {
    if (key === 'VITE_API_BASE_URL') {
      return 'http://localhost:5000';
    }
  },
}));

import AddProductForm from '../../components/AddProductForm';

describe('AddProductForm Component', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test('renders AddProductForm', () => {
    render(<AddProductForm restaurantId="123" />);
    expect(screen.getByPlaceholderText('Product Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Price')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    const token = 'fake-jwt-token';
    localStorage.setItem('token', token);
    mockAxios.onPost('http://localhost:5000/api/menus/123').reply(201, {});

    render(<AddProductForm restaurantId="123" />);

    fireEvent.change(screen.getByPlaceholderText('Product Name'), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Delicious food' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '10.99' } });

    fireEvent.submit(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1);
      expect(mockAxios.history.post[0].headers.Authorization).toBe(`Bearer ${token}`);
      expect(mockAxios.history.post[0].data).toEqual(JSON.stringify({
        name: 'New Product',
        description: 'Delicious food',
        price: '10.99'
      }));
    });

    localStorage.removeItem('token');
  });

  test('handles submission error', async () => {
    const token = 'fake-jwt-token';
    localStorage.setItem('token', token);
    mockAxios.onPost('http://localhost:5000/api/menus/123').reply(400, { message: 'Error adding product' });

    render(<AddProductForm restaurantId="123" />);

    fireEvent.change(screen.getByPlaceholderText('Product Name'), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Delicious food' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '10.99' } });

    fireEvent.submit(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.getByText('Error adding product')).toBeInTheDocument();
    });

    localStorage.removeItem('token');
  });
});

