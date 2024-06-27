const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const fetchMock = require('jest-fetch-mock');
const restaurantRoutes = require('../../routes/restaurantRoutes');
const Restaurant = require('../../models/Restaurant');
const User = require('../../models/User');
const dotenv = require('dotenv');
/**
 * Integration tests for Restaurant Routes
 * 
 * This file contains integration tests for the Restaurant routes using Jest and Supertest.
 * It includes tests to ensure the routes for creating, fetching, updating, and deleting restaurants work correctly.
 * 
 * - should create a new restaurant: Ensures that a new restaurant can be created via the POST /restaurants route.
 * - should get restaurant by ID: Verifies that a restaurant can be fetched by its ID via the GET /restaurants/:id route.
 * - should update a restaurant: Ensures that an existing restaurant can be updated via the PUT /restaurants/:id route.
 * - should delete a restaurant: Verifies that a restaurant can be deleted via the DELETE /restaurants/:id route.
 * - should get restaurants by proximity: Ensures that restaurants can be fetched by proximity via the GET /restaurants/proximity route.
 * - should get my restaurant: Verifies that a restaurant owned by the authenticated user can be fetched via the GET /restaurants/my route.
 * 
 */

dotenv.config();
fetchMock.enableMocks();

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api/restaurants', restaurantRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  jest.clearAllMocks();
  await Restaurant.deleteMany({});
  await User.deleteMany({});
  fetchMock.resetMocks(); // Reset fetch mocks after each test
});

describe('Restaurant Routes', () => {
  const mockManagerId = new mongoose.Types.ObjectId().toString();
  const mockRestaurantId = new mongoose.Types.ObjectId().toString();
  const mockManagerToken = jwt.sign({ _id: mockManagerId, role: 'manager' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const mockRestaurant = {
    name: 'Test Restaurant',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zip: '12345',
      location: { type: 'Point', coordinates: [-122.084, 37.421998] }
    },
    contact: '123-456-7890',
    manager: mockManagerId,
  };
  const createMockRestaurant = {
    name: 'Test Restaurant',
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip: '12345',
    contact: '123-456-7890',
  };

  beforeEach(async () => {
    const managerUser = new User({
      _id: mockManagerId,
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'password123',
      dateOfBirth: new Date('1980-01-01'),
      role: 'manager',
    });

    await managerUser.save();
  });

  it('should create a new restaurant', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({
      status: 'OK',
      results: [{
        geometry: {
          location: {
            lat: 37.421998,
            lng: -122.084,
          },
        },
      }],
    }));

    console.log('Sending payload:', createMockRestaurant);

    const res = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${mockManagerToken}`)
      .send(createMockRestaurant)
      .expect(201);

    console.log('Response body:', res.body);

    expect(res.body.name).toBe(createMockRestaurant.name);
    expect(res.body.address.city).toBe(createMockRestaurant.city);
  });

  it('should get restaurant by ID', async () => {
    console.log('---------------------------------------------');
    const restaurant = new Restaurant(mockRestaurant);
    const savedRestaurant = await restaurant.save();

    const res = await request(app)
      .get(`/api/restaurants/${savedRestaurant._id}`)
      .set('Authorization', `Bearer ${mockManagerToken}`)
      .expect(200);

    expect(res.body.name).toBe(mockRestaurant.name);
  });

  it('should update a restaurant', async () => {
    const restaurant = new Restaurant(mockRestaurant);
    const savedRestaurant = await restaurant.save();
    const updatedRestaurant = { ...mockRestaurant, name: 'Updated Restaurant' };

    const res = await request(app)
      .put(`/api/restaurants/${savedRestaurant._id}`)
      .set('Authorization', `Bearer ${mockManagerToken}`)
      .send(updatedRestaurant)
      .expect(200);

    expect(res.body.name).toBe(updatedRestaurant.name);
  });

  it('should delete a restaurant', async () => {
    const restaurant = new Restaurant(mockRestaurant);
    const savedRestaurant = await restaurant.save();

    const res = await request(app)
      .delete(`/api/restaurants/${savedRestaurant._id}`)
      .set('Authorization', `Bearer ${mockManagerToken}`)
      .expect(200);

    expect(res.body.message).toBe('Restaurant removed');

    const foundRestaurant = await Restaurant.findById(savedRestaurant._id);
    expect(foundRestaurant).toBeNull();
  });

  it('should get restaurants by proximity', async () => {
    const restaurant = new Restaurant(mockRestaurant);
    await restaurant.save();

    const res = await request(app)
      .get('/api/restaurants/near?lat=37.421998&lon=-122.084&maxDistance=5000')
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe(mockRestaurant.name);
  });

  it('should get my restaurant', async () => {
    const restaurant = new Restaurant(mockRestaurant);
    await restaurant.save();

    const res = await request(app)
      .get('/api/restaurants/me')
      .set('Authorization', `Bearer ${mockManagerToken}`)
      .expect(200);

    expect(res.body.name).toBe(mockRestaurant.name);
  });
});
