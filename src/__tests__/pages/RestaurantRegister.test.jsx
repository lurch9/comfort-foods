import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import RestaurantRegister from '../../pages/RestaurantRegister';
/**
 * Unit tests for RestaurantRegister Component
 * 
 * This file contains unit tests for the RestaurantRegister component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles input changes, processes successful registrations,
 * and manages registration errors.
 * 
 * - Renders the registration form: Ensures the RestaurantRegister component renders the registration form correctly.
 * - Handles input changes correctly: Verifies that the component handles input changes correctly.
 * - Handles successful registration: Ensures that the component processes a successful registration and responds accordingly.
 * - Handles registration error: Verifies that the component displays an error message when the registration fails.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 */

jest.mock('axios');

describe('RestaurantRegister Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(<RestaurantRegister />);
  };

  test('renders the registration form', () => {
    renderComponent();

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  test('handles input changes correctly', () => {
    renderComponent();

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Restaurant' } });
    expect(nameInput.value).toBe('Test Restaurant');

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');

    const streetInput = screen.getByLabelText(/Street/i);
    fireEvent.change(streetInput, { target: { value: '123 Test St' } });
    expect(streetInput.value).toBe('123 Test St');

    const cityInput = screen.getByLabelText(/City/i);
    fireEvent.change(cityInput, { target: { value: 'Test City' } });
    expect(cityInput.value).toBe('Test City');

    const stateInput = screen.getByLabelText(/State/i);
    fireEvent.change(stateInput, { target: { value: 'TS' } });
    expect(stateInput.value).toBe('TS');

    const zipInput = screen.getByLabelText(/Zip Code/i);
    fireEvent.change(zipInput, { target: { value: '12345' } });
    expect(zipInput.value).toBe('12345');

    const contactInput = screen.getByLabelText(/Contact/i);
    fireEvent.change(contactInput, { target: { value: '123-456-7890' } });
    expect(contactInput.value).toBe('123-456-7890');

    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'A great place to eat' } });
    expect(descriptionInput.value).toBe('A great place to eat');
  });

  test('handles successful registration', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Restaurant' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'TS' } });
    fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/Contact/i), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A great place to eat' } });

    fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/restaurants/register', expect.any(String), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  test('handles registration error', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Registration failed' } } });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Restaurant' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'TS' } });
    fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/Contact/i), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A great place to eat' } });

    fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });
});
