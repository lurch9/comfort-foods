const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../../models/User');
const generateToken = require('../../../utils/generateToken');
const userRoutes = require('../../../routes/userRoutes');
const dotenv = require('dotenv');

dotenv.config();

jest.mock('../../models/User');

const { mockUser, mockManager } = require('../../../__mocks__/authMiddleware');
jest.mock('../../middleware/authMiddleware', () => {
  const originalModule = jest.requireActual('../../middleware/authMiddleware');
  return {
    ...originalModule,
    protect: (req, res, next) => {
      req.user = { ...mockUser, save: jest.fn().mockResolvedValue(mockUser), _id: mockUser._id.toString() };
      next();
    },
    managerProtect: (req, res, next) => {
      req.user = { ...mockManager, save: jest.fn().mockResolvedValue(mockManager), _id: mockManager._id.toString() };
      next();
    },
  };
});

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
  app.use('/api/users', userRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  jest.clearAllMocks();
  await User.deleteMany({});
});

describe('User Controller', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user and return 201', async () => {
      const mockNewUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        city: 'Test City',
        dateOfBirth: '1990-01-01T00:00:00.000Z',
        role: 'user',
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockNewUser);

      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          city: 'Test City',
          dateOfBirth: '1990-01-01',
          role: 'user',
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        _id: mockNewUser._id,
        name: mockNewUser.name,
        email: mockNewUser.email,
        role: mockNewUser.role,
        token: expect.any(String),
      });
    });

    it('should return 400 if user already exists', async () => {
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          city: 'Test City',
          dateOfBirth: '1990-01-01',
          role: 'user',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'User already exists' });
    });
  });

  describe('loginUser', () => {
    it('should login a user and return 200', async () => {
      User.findOne.mockResolvedValue(mockUser);
      mockUser.matchPassword = jest.fn().mockResolvedValue(true);

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        _id: mockUser._id.toString(),
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        restaurantId: mockUser.restaurantId.toString(),
        token: expect.any(String),
      });
    });

    it('should return 401 for invalid email or password', async () => {
      User.findOne.mockResolvedValue(mockUser);
      mockUser.matchPassword = jest.fn().mockResolvedValue(false);

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Invalid email or password' });
    });
  });

  describe('getUserProfile', () => {
    it('should return the user profile if authenticated', async () => {
      User.findById.mockResolvedValue(mockUser);

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        _id: mockUser._id.toString(),
        name: mockUser.name,
        email: mockUser.email,
        street: mockUser.street,
        city: mockUser.city,
        state: mockUser.state,
        zip: mockUser.zip,
        dateOfBirth: mockUser.dateOfBirth.toISOString(),
        role: mockUser.role,
        restaurantId: mockUser.restaurantId.toString(),
      });
    });

    it('should return 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'User not found' });
    });
  });

  describe('updateUserProfile', () => {
    it('should update the user profile if authenticated', async () => {
      const updatedUser = {
        ...mockUser,
        name: 'Updated User',
        email: 'updated@example.com',
      };

      User.findById.mockResolvedValue(mockUser);
      mockUser.save = jest.fn().mockResolvedValue(updatedUser);

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Updated User',
          email: 'updated@example.com',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        street: updatedUser.street,
        city: updatedUser.city,
        state: updatedUser.state,
        zip: updatedUser.zip,
        dateOfBirth: updatedUser.dateOfBirth.toISOString(),
        token: expect.any(String),
      });
    });

    it('should return 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Updated User',
          email: 'updated@example.com',
        });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'User not found' });
    });
  });
});

