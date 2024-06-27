const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const Restaurant = require('../../../models/Restaurant');
const User = require('../../../models/User');
const restaurantRoutes = require('../../../routes/restaurantRoutes');
const { mockUser, mockManager } = require('../../../__mocks__/authMiddleware');
const generateToken = require('../../../utils/generateToken');
const userToken = generateToken(mockUser);
const managerToken = generateToken(mockManager);


jest.mock('../../models/Restaurant');
jest.mock('../../models/User');
jest.mock('node-fetch', () => jest.fn());
jest.mock('../../middleware/authMiddleware', () => {
    const originalModule = jest.requireActual('../../middleware/authMiddleware');
    return {
        ...originalModule,
        protect: (req, res, next) => {
            req.user = { ...mockManager, save: jest.fn().mockResolvedValue(mockManager), _id: mockManager._id.toString() };
            next();
        },
        managerProtect: (req, res, next) => {
            req.user = { ...mockManager, save: jest.fn().mockResolvedValue(mockManager), _id: mockManager._id.toString() };
            next();
        },
    };
});

let mongoServer;
let app;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
});

describe('Restaurant Controller', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('createRestaurant', () => {
        it('should create a restaurant and return 201', async () => {
            const mockGeocodeData = {
                status: 'OK',
                results: [
                    {
                        geometry: {
                            location: {
                                lat: 40.712776,
                                lng: -74.005974,
                            },
                        },
                    },
                ],
            };

            fetch.mockResolvedValue(new Response(JSON.stringify(mockGeocodeData)));

            const mockRestaurant = {
                _id: new mongoose.Types.ObjectId().toString(),
                name: 'Test Restaurant',
                address: {
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    zip: '12345',
                    location: {
                        type: 'Point',
                        coordinates: [-74.005974, 40.712776],
                    },
                },
                contact: '123-456-7890',
                manager: mockManager._id.toString(),
            };

            Restaurant.prototype.save = jest.fn().mockResolvedValue(mockRestaurant);

            const mockUserInstance = new User(mockManager);
            mockUserInstance.save = jest.fn().mockResolvedValue(mockUserInstance);
            User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUserInstance);

            const res = await request(app)
                .post('/api/restaurants')
                .set('Authorization', `Bearer ${managerToken}`)
                .send({
                    name: 'Test Restaurant',
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    zip: '12345',
                    contact: '123-456-7890',
                });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockRestaurant);
        });

        it('should return 400 for invalid address', async () => {
            const mockGeocodeData = {
                status: 'ZERO_RESULTS',
            };

            fetch.mockResolvedValue(new Response(JSON.stringify(mockGeocodeData)));

            const res = await request(app)
                .post('/api/restaurants')
                .set('Authorization', `Bearer ${managerToken}`)
                .send({
                    name: 'Test Restaurant',
                    street: 'Invalid St',
                    city: 'Invalid City',
                    state: 'Invalid State',
                    zip: '00000',
                    contact: '123-456-7890',
                });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Invalid address' });
        });
    });

    describe('getMyRestaurant', () => {
        it('should return the restaurant managed by the user', async () => {
            const mockRestaurant = {
                _id: new mongoose.Types.ObjectId().toString(),
                name: 'Test Restaurant',
                address: {
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    zip: '12345',
                    location: {
                        type: 'Point',
                        coordinates: [-74.005974, 40.712776],
                    },
                },
                contact: '123-456-7890',
                manager: mockManager._id.toString(),
            };

            Restaurant.findOne = jest.fn().mockResolvedValue(mockRestaurant);

            const res = await request(app)
                .get('/api/restaurants/me')
                .set('Authorization', `Bearer ${managerToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockRestaurant);
        });

        it('should return 404 if no restaurant found', async () => {
            Restaurant.findOne = jest.fn().mockResolvedValue(null);

            const res = await request(app)
                .get('/api/restaurants/me')
                .set('Authorization', `Bearer ${managerToken}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Restaurant not found' });
        });
    });

    describe('deleteRestaurant', () => {
        it('should delete the restaurant if the manager is authorized', async () => {
            const mockRestaurant = {
                _id: new mongoose.Types.ObjectId().toString(),
                name: 'Test Restaurant',
                address: {
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    zip: '12345',
                    location: {
                        type: 'Point',
                        coordinates: [-74.005974, 40.712776],
                    },
                },
                contact: '123-456-7890',
                manager: mockManager._id.toString(),
            };

            Restaurant.findById = jest.fn().mockResolvedValue(mockRestaurant);
            Restaurant.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
            User.prototype.save = jest.fn().mockResolvedValue(mockManager);

            const res = await request(app)
                .delete(`/api/restaurants/${mockRestaurant._id}`)
                .set('Authorization', `Bearer ${managerToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Restaurant removed' });
        });

        it('should return 401 if the user is not authorized', async () => {
            const mockRestaurant = {
                _id: new mongoose.Types.ObjectId().toString(),
                name: 'Test Restaurant',
                address: {
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    zip: '12345',
                    location: {
                        type: 'Point',
                        coordinates: [-74.005974, 40.712776],
                    },
                },
                contact: '123-456-7890',
                manager: new mongoose.Types.ObjectId().toString(),
            };

            Restaurant.findById = jest.fn().mockResolvedValue(mockRestaurant);

            const res = await request(app)
                .delete(`/api/restaurants/${mockRestaurant._id}`)
                .set('Authorization', `Bearer ${managerToken}`);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ message: 'Not authorized to delete this restaurant' });
        });

        it('should return 404 if restaurant not found', async () => {
            Restaurant.findById = jest.fn().mockResolvedValue(null);

            const res = await request(app)
                .delete(`/api/restaurants/${new mongoose.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${managerToken}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Restaurant not found' });
        });
    });

    describe('getRestaurantById', () => {
        it('should return the restaurant if found', async () => {
            const mockRestaurant = {
                _id: new mongoose.Types.ObjectId().toString(),
                name: 'Test Restaurant',
                address: {
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    zip: '12345',
                    location: {
                        type: 'Point',
                        coordinates: [-74.005974, 40.712776],
                    },
                },
                contact: '123-456-7890',
                manager: mockManager._id.toString(),
            };

            Restaurant.findById = jest.fn().mockResolvedValue(mockRestaurant);

            const res = await request(app)
                .get(`/api/restaurants/${mockRestaurant._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockRestaurant);
        });

        it('should return 404 if restaurant not found', async () => {
            Restaurant.findById = jest.fn().mockResolvedValue(null);

            const res = await request(app)
                .get(`/api/restaurants/${new mongoose.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Restaurant not found' });
        });
    });

    describe('updateRestaurant', () => {
        it('should update the restaurant if found', async () => {
            const mockRestaurant = {
                _id: new mongoose.Types.ObjectId().toString(),
                name: 'Test Restaurant',
                address: {
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    zip: '12345',
                    location: {
                        type: 'Point',
                        coordinates: [-74.005974, 40.712776],
                    },
                },
                contact: '123-456-7890',
                manager: mockManager._id.toString(),
            };

            Restaurant.findById = jest.fn().mockResolvedValue(mockRestaurant);
            const saveMock = jest.fn().mockResolvedValue({
                ...mockRestaurant,
                name: 'Updated Restaurant',
            });
            mockRestaurant.save = jest.fn().mockImplementation(saveMock);

            const updatedName = 'Updated Restaurant';
            const res = await request(app)
                .put(`/api/restaurants/${mockRestaurant._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .send({
                    name: updatedName,
                });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                _id: mockRestaurant._id,
                name: updatedName,
                address: {
                    street: mockRestaurant.address.street,
                    city: mockRestaurant.address.city,
                    state: mockRestaurant.address.state,
                    zip: mockRestaurant.address.zip,
                    location: mockRestaurant.address.location,
                },
                contact: mockRestaurant.contact,
                manager: mockRestaurant.manager,
            });
        });

        it('should return 404 if restaurant not found', async () => {
            Restaurant.findById = jest.fn().mockResolvedValue(null);

            const res = await request(app)
                .put(`/api/restaurants/${new mongoose.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .send({
                    name: 'Updated Restaurant',
                });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Restaurant not found' });
        });
    });

    describe('getRestaurantsByProximity', () => {
        it('should return restaurants within the specified proximity', async () => {
            const mockRestaurants = [
                {
                    _id: new mongoose.Types.ObjectId().toString(),
                    name: 'Test Restaurant',
                    address: {
                        street: '123 Test St',
                        city: 'Test City',
                        state: 'Test State',
                        zip: '12345',
                        location: {
                            type: 'Point',
                            coordinates: [-74.005974, 40.712776],
                        },
                    },
                    contact: '123-456-7890',
                },
            ];

            Restaurant.find = jest.fn().mockResolvedValue(mockRestaurants);

            const res = await request(app)
                .get('/api/restaurants/near?lat=40.712776&lon=-74.005974&maxDistance=5000')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockRestaurants);
        });

        it('should return 404 if no restaurants found within the specified proximity', async () => {
            Restaurant.find = jest.fn().mockResolvedValue([]);

            const res = await request(app)
                .get('/api/restaurants/near?lat=40.712776&lon=-74.005974&maxDistance=5000')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'No restaurants found near the provided location.' });
        });

        it('should return 500 if there is a server error', async () => {
            Restaurant.find = jest.fn().mockRejectedValue(new Error('Server error'));

            const res = await request(app)
                .get('/api/restaurants/near?lat=40.712776&lon=-74.005974&maxDistance=5000')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Server error' });
        });
    });
});
