process.env.NODE_ENV = 'test'; // Set the environment to 'test'

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Order = require('../../../models/Order');
const generateToken = require('../../../utils/generateToken');
const orderRoutes = require('../../../routes/orderRoutes');
const dotenv = require('dotenv');

dotenv.config();

jest.mock('../../models/Order');

// Mock the auth middleware
jest.mock('../../middleware/authMiddleware', () => require('../../../__mocks__/authMiddleware'));

const mockUser = require('../../../__mocks__/authMiddleware').mockUser;
const mockManager = require('../../../__mocks__/authMiddleware').mockManager;

const userToken = generateToken(mockUser);
const managerToken = generateToken(mockManager);

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  app = express();
  app.use(express.json());

  const ioEmitMock = jest.fn();
  app.use((req, res, next) => {
    req.io = { emit: ioEmitMock };
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
});

describe('Order Controller', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('getOrderById', () => {
    it('should return 400 if order ID is invalid', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValueOnce(false);
      const res = await request(app).get('/api/orders/invalid-id').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid order ID' });
    });

    it('should return 404 if order not found', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValueOnce(true);
      Order.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      const res = await request(app).get(`/api/orders/${new mongoose.Types.ObjectId()}`).set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Order not found' });
    });

    it('should return order if found', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValueOnce(true);
      const mockOrder = {
        _id: new mongoose.Types.ObjectId(),
        restaurant: mockManager.restaurantId,
        user: { ...mockUser, _id: mockUser._id, dateOfBirth: mockUser.dateOfBirth },
      };
      Order.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrder),
      });
      const res = await request(app).get(`/api/orders/${mockOrder._id}`).set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(JSON.parse(JSON.stringify(mockOrder))); // Ensure deep equality
    });
  });

  describe('getOrderBySessionId', () => {
    it('should return 404 if order not found', async () => {
      Order.findOne.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/orders/confirmation/invalid-session-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Order not found' });
    });

    it('should return order if found', async () => {
      const mockOrder = { sessionId: 'valid-session-id', restaurant: mockManager.restaurantId.toString() };
      Order.findOne.mockResolvedValue(mockOrder);

      const res = await request(app)
        .get('/api/orders/confirmation/valid-session-id')
        .set('Authorization', `Bearer ${userToken}`);
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrder);
    });
  });

  describe('getUserOrders', () => {
    it('should return user orders', async () => {
      const mockOrders = [
        { _id: new mongoose.Types.ObjectId(), user: { ...mockUser, _id: mockUser._id, dateOfBirth: mockUser.dateOfBirth }, restaurant: mockManager.restaurantId.toString() },
        { _id: new mongoose.Types.ObjectId(), user: { ...mockUser, _id: mockUser._id, dateOfBirth: mockUser.dateOfBirth }, restaurant: mockManager.restaurantId.toString() },
      ];
      Order.find.mockResolvedValue(mockOrders);
      const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(JSON.parse(JSON.stringify(mockOrders))); // Ensure deep equality
    });
  });

  describe('updateOrderStatus', () => {
    it('should return 404 if order not found', async () => {
      Order.findById.mockResolvedValue(null);
      const res = await request(app).put(`/api/orders/${new mongoose.Types.ObjectId()}/status`).send({ status: 'completed' }).set('Authorization', `Bearer ${managerToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Order not found' });
    });

    it('should update order status if order found', async () => {
      console.log('-------------------------------------------');
      const mockOrderId = new mongoose.Types.ObjectId().toString(); // Fix this line
      const mockOrder = { _id: mockOrderId, restaurant: mockManager.restaurantId.toString(), status: 'pending', save: jest.fn().mockResolvedValue({ _id: mockOrderId, status: 'completed' }) };
      Order.findById.mockResolvedValue(mockOrder);
      const res = await request(app).put(`/api/orders/${mockOrderId}/status`).send({ status: 'completed' }).set('Authorization', `Bearer ${managerToken}`);
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id: mockOrderId, status: 'completed' });
    });
  });

  describe('getRestaurantOrders', () => {
    it('should return 400 if restaurant ID is invalid', async () => {
      console.log('-------------------------------------------');
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValueOnce(false);
      const res = await request(app).get('/api/orders/restaurant').set('Authorization', `Bearer ${managerToken}`);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid restaurant ID' });
    });

    it('should return 404 if no orders found', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValueOnce(true);
      Order.find.mockResolvedValue([]);
      const res = await request(app).get('/api/orders/restaurant').set('Authorization', `Bearer ${managerToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'No orders found for this restaurant' });
    });

    it('should return orders if found', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValueOnce(true);
      const mockOrders = [
        { _id: new mongoose.Types.ObjectId(), restaurant: mockManager.restaurantId, status: 'completed' },
        { _id: new mongoose.Types.ObjectId(), restaurant: mockManager.restaurantId, status: 'completed' }
      ];
      Order.find.mockResolvedValue(mockOrders);
      const res = await request(app).get('/api/orders/restaurant').set('Authorization', `Bearer ${managerToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(JSON.parse(JSON.stringify(mockOrders))); // Ensure deep equality
    });
  });

  describe('getCompletedOrders', () => {
    it('should return 400 if restaurant ID is invalid', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValueOnce(false);
      const res = await request(app).get('/api/orders/completed/invalid-id').set('Authorization', `Bearer ${managerToken}`);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid restaurant ID' });
    });

    it('should return 404 if no completed orders found', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValueOnce(true);
      Order.find.mockResolvedValue([]);
      const res = await request(app).get(`/api/orders/completed/${mockManager.restaurantId}`).set('Authorization', `Bearer ${managerToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'No completed orders found for this restaurant' });
    });

    it('should return completed orders if found', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValueOnce(true);
      const mockOrders = [
        { _id: new mongoose.Types.ObjectId(), restaurant: mockManager.restaurantId, status: 'completed' },
        { _id: new mongoose.Types.ObjectId(), restaurant: mockManager.restaurantId, status: 'completed' }
      ];
      Order.find.mockResolvedValue(mockOrders);
      const res = await request(app).get(`/api/orders/completed/${mockManager.restaurantId}`).set('Authorization', `Bearer ${managerToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(JSON.parse(JSON.stringify(mockOrders))); // Ensure deep equality
    });
  });
});










