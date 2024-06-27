import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
/**
 * Unit tests for EditMenu Component
 * 
 * This file contains unit tests for the EditMenu component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles form interactions,
 * adds and removes menu items, submits the form, and handles API errors.
 * 
 * - Renders EditMenu form with fetched data: Verifies the component renders the form with data fetched from the API.
 * - Handles menu name change: Checks that the component correctly handles changes to the menu name input.
 * - Handles adding a new menu item: Verifies that the component correctly handles adding a new menu item to the list.
 * - Handles removing a menu item: Verifies that the component correctly handles removing a menu item from the list.
 * - Submits form successfully: Mocks an API call to submit the form and checks that the form is submitted with the correct data.
 * - Handles API errors: Mocks API error responses and checks that the component displays error messages correctly.
 */

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
      },
    }),
  };
});

import EditMenu from '../../components/EditMenu';

describe('EditMenu Component', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/edit-menu/1']}>
        <Routes>
          <Route path="/edit-menu/:id" element={<EditMenu />} />
          <Route path="/manager-menus" element={<div>Manager Menus</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders EditMenu form with fetched data', async () => {
    const mockMenu = {
      name: 'Test Menu',
      items: [
        { name: 'Item 1', description: 'Description 1', price: 10 },
        { name: 'Item 2', description: 'Description 2', price: 20 },
      ],
    };

    mockAxios.onGet('http://localhost:5000/api/menus/1').reply(200, mockMenu);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Menu')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Item 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Description 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Item 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Description 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    });
  });

  test('handles menu name change', async () => {
    const mockMenu = {
      name: 'Test Menu',
      items: [
        { name: 'Item 1', description: 'Description 1', price: 10 },
        { name: 'Item 2', description: 'Description 2', price: 20 },
      ],
    };

    mockAxios.onGet('http://localhost:5000/api/menus/1').reply(200, mockMenu);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Menu')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Menu Name:'), {
      target: { value: 'Updated Menu' },
    });

    expect(screen.getByDisplayValue('Updated Menu')).toBeInTheDocument();
  });

  test('handles adding a new menu item', async () => {
    const mockMenu = {
      name: 'Test Menu',
      items: [
        { name: 'Item 1', description: 'Description 1', price: 10 },
        { name: 'Item 2', description: 'Description 2', price: 20 },
      ],
    };

    mockAxios.onGet('http://localhost:5000/api/menus/1').reply(200, mockMenu);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Menu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/add item/i));

    expect(screen.getAllByLabelText(/name/i).length).toBe(4);
  });

  test('handles removing a menu item', async () => {
    const mockMenu = {
      name: 'Test Menu',
      items: [
        { name: 'Item 1', description: 'Description 1', price: 10 },
        { name: 'Item 2', description: 'Description 2', price: 20 },
      ],
    };

    mockAxios.onGet('http://localhost:5000/api/menus/1').reply(200, mockMenu);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Menu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText(/remove item/i)[0]);

    expect(screen.getAllByLabelText(/name/i).length).toBe(2);
  });

  test('submits form successfully', async () => {
    const mockMenu = {
      name: 'Test Menu',
      items: [
        { name: 'Item 1', description: 'Description 1', price: 10 },
        { name: 'Item 2', description: 'Description 2', price: 20 },
      ],
    };

    mockAxios.onGet('http://localhost:5000/api/menus/1').reply(200, mockMenu);
    mockAxios.onPut('http://localhost:5000/api/menus/1').reply(200);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Menu')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Menu Name:'), {
      target: { value: 'Updated Menu' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /update menu/i }));

    await waitFor(() => {
      expect(screen.getByText('Manager Menus')).toBeInTheDocument();
    });
  });

  test('handles API errors', async () => {
    mockAxios.onGet('http://localhost:5000/api/menus/1').reply(500, {
      message: 'Internal Server Error',
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
    });
  });
});


