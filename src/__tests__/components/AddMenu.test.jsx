/**
 * Unit tests for AddMenu Component
 * 
 * This file contains unit tests for the AddMenu component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles successful form submission,
 * and displays error messages on submission failure.
 * 
 * - Renders AddMenu form: Verifies the form elements are rendered correctly.
 * - Submits form successfully: Mocks an API call to create a menu and checks that the form is submitted and cleared.
 * - Handles submission error: Mocks an API error response and checks that the error message is displayed.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock the getEnv utility
jest.mock('../../utils/env', () => ({
  getEnv: (key) => {
    if (key === 'VITE_API_BASE_URL') {
      return 'http://localhost:5000';
    }
  },
}));

// Mock AuthContext
jest.mock('../../context/AuthContext', () => {
  const originalModule = jest.requireActual('../../context/AuthContext');
  return {
    __esModule: true,
    ...originalModule,
    useAuth: () => ({
      user: {
        token: 'fake-jwt-token',
        restaurantId: '123',
        role: 'manager',
      },
    }),
  };
});

import AddMenu from '../../components/AddMenu';

describe('AddMenu Component', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test('renders AddMenu form', () => {
    render(<AddMenu />);
    expect(screen.getByText('Add Menu')).toBeInTheDocument();
    expect(screen.getByLabelText('Menu Name:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create menu/i })).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    const onMenuCreatedMock = jest.fn();
    mockAxios.onPost('http://localhost:5000/api/menus').reply(201, {});

    render(<AddMenu onMenuCreated={onMenuCreatedMock} />);

    fireEvent.change(screen.getByLabelText('Menu Name:'), { target: { value: 'New Menu' } });
    fireEvent.click(screen.getByRole('button', { name: /create menu/i }));

    await waitFor(() => {
      expect(onMenuCreatedMock).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText('Menu Name:').value).toBe('');
    });
  });

  test('handles submission error', async () => {
    mockAxios.onPost('http://localhost:5000/api/menus').reply(400, { message: 'Error creating menu' });

    render(<AddMenu />);

    fireEvent.change(screen.getByLabelText('Menu Name:'), { target: { value: 'New Menu' } });
    fireEvent.click(screen.getByRole('button', { name: /create menu/i }));

    await waitFor(() => {
      expect(screen.getByText('Error creating menu')).toBeInTheDocument();
    });
  });
});


