const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const orderRoutes = require('../../routes/orderRoutes');
const Order = require('../../models/Order');
const User = require('../../models/User');
const dotenv = require('dotenv');
/**
 * Integration tests for Order Routes
 * 
 * This file contains integration tests for the Order routes using Jest and Supertest.
 * It includes tests to ensure the routes for creating, fetching, updating, and deleting orders work correctly.
 * 
 * - should get orders by user: Ensures that orders can be fetched by user ID via the GET /orders/user/:userId route.
 * - should get order by session ID: Verifies that an order can be fetched by session ID via the GET /orders/session/:sessionId route.
 * - should get order by ID: Ensures that a single order can be fetched by its ID via the GET /orders/:id route.
 * - should get restaurant orders: Verifies that orders can be fetched by restaurant ID via the GET /orders/restaurant/:restaurantId route.
 * - should update order status: Ensures that an order status can be updated via the PUT /orders/:id/status route.
 * - should get completed orders by restaurant ID: Verifies that completed orders can be fetched by restaurant ID via the GET /orders/restaurant/:restaurantId/completed route.
 * 
 */

dotenv.config();

let mongoServer;
let app;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  
    ioEmitSpy = jest.fn();
  
    app = express();
    app.use(express.json());
  
    // Mock WebSocket functionality
    app.use((req, res, next) => {
      req.io = { emit: ioEmitSpy }; // Mock the emit function
      next();
    });

  app.use('/api/orders', orderRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  jest.clearAllMocks();
  await Order.deleteMany({});
  await User.deleteMany({});
});

describe('Order Routes', () => {
    const mockUserId = new mongoose.Types.ObjectId().toString();
    const mockManagerId = new mongoose.Types.ObjectId().toString(); // Assume this is the manager's ID
    const mockRestaurantId = new mongoose.Types.ObjectId().toString();
    const mockToken = jwt.sign({ _id: mockUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const mockManagerToken = jwt.sign(
      { _id: mockManagerId, role: 'manager' }, // Include role as 'manager'
      process.env.JWT_SECRET
    );

  const mockOrder = {
    user: mockUserId,
    restaurant: mockRestaurantId,
    items: [
      { product: new mongoose.Types.ObjectId(), name: 'Product 1', quantity: 1, price: 100 },
    ],
    total: 100,
    paymentIntentId: 'pi_1FzRBw2eZvKYlo2CtXN7U7',
    sessionId: 'cs_test_a1b2c3d4',
    status: 'pending',
  };

  beforeEach(async () => {
    const managerUser = new User({
        _id: mockManagerId,
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'password123',
        dateOfBirth: new Date('1980-01-01'),
        role: 'manager', // Ensure the user role is set to 'manager'
        restaurantId: mockRestaurantId, // Assign the restaurant ID to the manager
      });
  
    await managerUser.save();

    const user = new User({
      _id: mockUserId,
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
      dateOfBirth: new Date('1990-01-01'),
      role: 'user',
    });

    await user.save();
  });

  it('should get orders by user', async () => {
    const order = new Order(mockOrder);
    await order.save();

    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].total).toBe(mockOrder.total);
  });

  it('should get order by session ID', async () => {
    const order = new Order(mockOrder);
    await order.save();

    const res = await request(app)
      .get(`/api/orders/confirmation/${mockOrder.sessionId}`)
      .expect(200);

    expect(res.body.total).toBe(mockOrder.total);
  });

  it('should get order by ID', async () => {
    const order = new Order(mockOrder);
    const savedOrder = await order.save();

    const res = await request(app)
      .get(`/api/orders/${savedOrder._id}`)
      .expect(200);

    expect(res.body.total).toBe(mockOrder.total);
  });

  it('should get restaurant orders', async () => {
    const order = new Order(mockOrder);
    await order.save();

    const res = await request(app)
      .get('/api/orders/restaurant')
      .set('Authorization', `Bearer ${mockManagerToken}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].total).toBe(mockOrder.total);
  });

  it('should update order status', async () => {

    const order = new Order(mockOrder);
    const savedOrder = await order.save();
    const updatedStatus = { status: 'completed' };

    const res = await request(app)
      .put(`/api/orders/${savedOrder._id}/status`)
      .set('Authorization', `Bearer ${mockManagerToken}`)
      .send(updatedStatus)
      .expect(200);


    expect(res.body.status).toBe(updatedStatus.status);

    expect(ioEmitSpy).toHaveBeenCalledWith('orderStatusUpdated', {
      orderId: savedOrder._id, // Convert ObjectId to string
      status: updatedStatus.status,
    });
  });

  it('should get completed orders by restaurant ID', async () => {
    const order = new Order({ ...mockOrder, status: 'completed' });
    await order.save();

    const res = await request(app)
      .get(`/api/orders/completed/${mockOrder.restaurant}`)
      .set('Authorization', `Bearer ${mockManagerToken}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].total).toBe(mockOrder.total);
  });
});
