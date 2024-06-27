const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const userRoutes = require('../../routes/userRoutes');
const User = require('../../models/User');
const dotenv = require('dotenv');
/**
 * Integration tests for User Routes
 * 
 * This file contains integration tests for the User routes using Jest and Supertest.
 * It includes tests to ensure the routes for registering, logging in, fetching, and updating user profiles work correctly.
 * 
 * - should register a new user: Ensures that a new user can be registered via the POST /users/register route.
 * - should login a user: Verifies that a user can log in via the POST /users/login route.
 * - should get user profile: Ensures that the user's profile can be fetched via the GET /users/profile route.
 * - should update user profile: Verifies that the user's profile can be updated via the PUT /users/profile route.
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

describe('User Routes', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockToken = jwt.sign({ _id: mockUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const mockUser = {
    _id: mockUserId,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    dateOfBirth: new Date('1990-01-01'),
    role: 'user',  // Ensure the role is included
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send(mockUser)
      .expect(201);

    expect(res.body.name).toBe(mockUser.name);
    expect(res.body.email).toBe(mockUser.email);
  });

  it('should login a user', async () => {
    const user = new User(mockUser);
    await user.save();

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: mockUser.email, password: mockUser.password })
      .expect(200);

    expect(res.body.email).toBe(mockUser.email);
    expect(res.body.token).toBeDefined();
  });

  it('should get user profile', async () => {
    const user = new User(mockUser);
    await user.save();

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);

    expect(res.body.email).toBe(mockUser.email);
  });

  it('should update user profile', async () => {
    const user = new User(mockUser);
    await user.save();

    const updatedProfile = { ...mockUser, name: 'Updated Name' };

    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(updatedProfile)
      .expect(200);

    expect(res.body.name).toBe(updatedProfile.name);
  });
});
