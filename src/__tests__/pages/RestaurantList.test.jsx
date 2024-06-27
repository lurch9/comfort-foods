import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import RestaurantList from '../../pages/RestaurantList';
import { getEnv } from '../../utils/env';
import { useLoadScript } from '@react-google-maps/api';
/**
 * Unit tests for RestaurantList Component
 * 
 * This file contains unit tests for the RestaurantList component using React Testing Library and Jest.
 * It includes tests to ensure the component renders correctly, handles loading states, fetches and 
 * displays restaurants based on user location, displays error messages on fetch errors, shows messages 
 * when no restaurants are found, and prompts for address input when not loading and not searched.
 * 
 * - Renders loading state initially: Ensures the RestaurantList component shows a loading state initially.
 * - Fetches and displays restaurants based on user location: Verifies that the component fetches and correctly displays 
 *   - restaurants based on the user's location.
 * - Displays error message on fetch error: Ensures the component displays an error message if fetching restaurants fails.
 * - Displays message when no restaurants are found: Verifies that the component displays a message when no restaurants are found.
 * - Displays prompt to enter address and search when not loading and not searched: Ensures the component prompts the user to enter 
 *   - an address and search when it is not loading and has not been searched.
 * 
 * Dependencies mocked:
 * - axios: Mocked to avoid actual API calls during testing.
 * - ../utils/env: Mocked to manage environment variables during tests.
 * - @react-google-maps/api: Mocked to avoid actual Google Maps API calls during testing.
 */


jest.mock('axios');
jest.mock('../../utils/env', () => ({
  getEnv: jest.fn(),
}));
jest.mock('@react-google-maps/api', () => ({
  useLoadScript: jest.fn(),
  StandaloneSearchBox: ({ children }) => <div>{children}</div>,
}));


/**
 * Not sure if this line is necessary, I don't remember why I added it at the moment.
 * It's related the last test in this suite, so if that test fails uncomment this block.
 */

/*
 const MockRestaurantList = ({ loading, searched }) => {
   return <RestaurantList loading={loading} searched={searched} />;
 };
*/



describe('RestaurantList Component', () => {
  const API_BASE_URL = 'http://localhost:5000';
  const GOOGLE_MAPS_API_KEY = 'fake-api-key';


  beforeEach(() => {
    jest.clearAllMocks();
    getEnv.mockImplementation((key) => {
      if (key === 'VITE_API_BASE_URL') {
        return API_BASE_URL;
      }
      if (key === 'VITE_MAPS_API') {
        return GOOGLE_MAPS_API_KEY;
      }
      return undefined;
    });

    useLoadScript.mockReturnValue({
      isLoaded: true,
    });

    // Mocking the geolocation API
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        success({
          coords: {
            latitude: 40.73061,
            longitude: -73.935242,
          },
        })
      ),
    };
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <RestaurantList />
      </MemoryRouter>
    );
  };

  test('renders loading state initially', () => {
    useLoadScript.mockReturnValue({
      isLoaded: false,
    });

    renderComponent();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays restaurants based on user location', async () => {
    const mockRestaurants = [
      {
        _id: '1',
        name: 'Test Restaurant 1',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
          location: {
            type: 'Point',
            coordinates: [-73.935242, 40.73061]
          }
        },
        contact: '123-456-7890',
        manager: '60c72b2f9b1d8a001c8f5678'
      },
      {
        _id: '2',
        name: 'Test Restaurant 2',
        address: {
          street: '456 Test Ave',
          city: 'Test City',
          state: 'TS',
          zip: '67890',
          location: {
            type: 'Point',
            coordinates: [-73.935242, 40.73061]
          }
        },
        contact: '987-654-3210',
        manager: '60c72b2f9b1d8a001c8f5678'
      },
    ];

    axios.get.mockResolvedValue({ data: mockRestaurants });

    renderComponent();

    await waitFor(() => expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument());
    expect(screen.getByText('123 Test St, Test City, TS 12345')).toBeInTheDocument();
    expect(screen.getByText('Contact: 123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('Test Restaurant 2')).toBeInTheDocument();
    expect(screen.getByText('456 Test Ave, Test City, TS 67890')).toBeInTheDocument();
    expect(screen.getByText('Contact: 987-654-3210')).toBeInTheDocument();
  });

  test('displays error message on fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Fetch failed'));

    renderComponent();

    fireEvent.submit(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument();
    });
  });

  test('displays message when no restaurants are found', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderComponent();

    fireEvent.submit(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('No restaurants found in your area.')).toBeInTheDocument();
    });
  });
  test('displays prompt to enter address and search when not loading and not searched', () => {
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn((success, error) => {
        // Simulate geolocation failure
        error({ message: 'Geolocation error' });
      }),
    };
    render(<RestaurantList />);

    // Simulate the component being not loading and not searched
    expect(screen.getByText('Enter your address and hit search to find registered restaurants near you!')).toBeInTheDocument();
  });
});
