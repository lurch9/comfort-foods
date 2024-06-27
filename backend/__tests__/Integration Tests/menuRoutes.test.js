const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const menuRoutes = require('../../routes/menuRoutes');
const Menu = require('../../models/Menu');
const User = require('../../models/User');
const dotenv = require('dotenv');
/**
 * Integration tests for Menu Routes
 * 
 * This file contains integration tests for the Menu routes using Jest and Supertest.
 * It includes tests to ensure the routes for creating, fetching, updating, and deleting menus work correctly.
 * 
 * - should create a new menu: Ensures that a new menu can be created via the POST /menus route.
 * - should get menus by restaurant: Verifies that menus can be fetched by restaurant ID via the GET /menus/:restaurantId route.
 * - should get menu by id: Ensures that a single menu can be fetched by its ID via the GET /menus/menu/:id route.
 * - should update a menu: Verifies that an existing menu can be updated via the PUT /menus/menu/:id route.
 * - should delete a menu: Ensures that an existing menu can be deleted via the DELETE /menus/menu/:id route.
 * 
 */

dotenv.config();

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api/menus', menuRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  jest.clearAllMocks();
  await Menu.deleteMany({});
  await User.deleteMany({});
});

describe('Menu Routes', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockManagerId = new mongoose.Types.ObjectId().toString();
  const mockRestaurantId = new mongoose.Types.ObjectId().toString();
  const mockToken = jwt.sign({ _id: mockManagerId, role: 'manager' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const mockMenu = {
    name: 'Test Menu',
    items: [],
    restaurantId: mockRestaurantId,
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

  it('should create a new menu', async () => {
    console.log('Sending payload:', mockMenu); // Log the payload being sent

    const res = await request(app)
      .post('/api/menus')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(mockMenu)
      .expect(201);

    console.log('Response body:', res.body); // Log the response body

    // Check the database state
    const savedMenu = await Menu.findById(res.body._id);
    console.log('Saved menu from DB:', savedMenu);

    expect(res.body.name).toBe(mockMenu.name);
    expect(res.body.items.length).toBe(0); // Expect items to be an empty array
  });

  it('should get menus by restaurant', async () => {
    const menu = new Menu(mockMenu);
    await menu.save();

    const res = await request(app)
      .get(`/api/menus/restaurant/${mockRestaurantId}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe(mockMenu.name);
  });

  it('should get menu by id', async () => {
    const menu = new Menu(mockMenu);
    const savedMenu = await menu.save();

    const res = await request(app)
      .get(`/api/menus/${savedMenu._id}`)
      .expect(200);

    expect(res.body.name).toBe(mockMenu.name);
  });

  it('should update a menu', async () => {
    const menu = new Menu(mockMenu);
    const savedMenu = await menu.save();
    const updatedMenu = { ...mockMenu, name: 'Updated Menu' };

    const res = await request(app)
      .put(`/api/menus/${savedMenu._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send(updatedMenu)
      .expect(200);

    expect(res.body.name).toBe(updatedMenu.name);
  });

  it('should delete a menu', async () => {
    const menu = new Menu(mockMenu);
    const savedMenu = await menu.save();
  
    const res = await request(app)
      .delete(`/api/menus/${savedMenu._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200); // Expecting 200 OK
  
    expect(res.body.message).toBe('Menu removed'); // Check the response message
  
    const foundMenu = await Menu.findById(savedMenu._id);
    expect(foundMenu).toBeNull();
  });
});


