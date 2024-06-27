// __tests__/menuController.test.js
process.env.NODE_ENV = 'test';

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Menu = require('../../../models/Menu');
const generateToken = require('../../../utils/generateToken');
const menuRoutes = require('../../../routes/menuRoutes');
const dotenv = require('dotenv');

dotenv.config();

jest.mock('../../models/Menu');

// Mock the auth middleware
jest.mock('../../middleware/authMiddleware', () => require('../../../__mocks__/authMiddleware'));

const mockUser = require('../../../__mocks__/authMiddleware').mockUser;
const mockManager = require('../../../__mocks__/authMiddleware').mockManager;

const menuId = new mongoose.Types.ObjectId();
const restaurantId = new mongoose.Types.ObjectId();
const userToken = generateToken(mockUser);
const managerToken = generateToken(mockManager);

let mongoServer;
let app;
/**
 * Unit tests for Menu Controller
 * 
 * This file contains unit tests for the Menu controller using Jest.
 * It includes tests to ensure the controller methods for creating, fetching, updating, and deleting menus work correctly.
 * 
 * - createMenu: Ensures that a new menu can be created.
 * - getMenusByRestaurant: Ensures that menus can be fetched by restaurant ID, and returns 404 if no menus are found.
 * - getMenuById: Ensures that a single menu can be fetched by its ID, and returns 404 if the menu is not found.
 * - updateMenu: Ensures that an existing menu can be updated, and returns 404 if the menu is not found.
 * - deleteMenu: Ensures that an existing menu can be deleted, and returns 404 if the menu is not found.
 */

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
});

describe('Menu Controller', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('createMenu', () => {
    it('should return 400 if restaurant ID is missing', async () => {
      const res = await request(app)
        .post('/api/menus')
        .send({ name: 'Lunch Menu' })
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Restaurant ID is required' });
    });

    it('should create a new menu', async () => {
      const newMenu = { name: 'Lunch Menu', restaurantId: restaurantId.toString() };
      Menu.prototype.save.mockResolvedValue({ ...newMenu, _id: menuId });

      const res = await request(app)
        .post('/api/menus')
        .send(newMenu)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ ...newMenu, _id: menuId.toString() });
    });
  });

  describe('getMenusByRestaurant', () => {
    it('should return 404 if no menus found', async () => {
      Menu.find.mockResolvedValue([]);

      const res = await request(app)
        .get(`/api/menus/restaurant/${restaurantId}`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Menus not found' });
    });

    it('should return menus for the restaurant', async () => {
      const menus = [{ _id: menuId, name: 'Lunch Menu', restaurantId: restaurantId.toString() }];
      Menu.find.mockResolvedValue(menus);

      const res = await request(app)
        .get(`/api/menus/restaurant/${restaurantId}`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(menus.map(menu => ({ ...menu, _id: menu._id.toString(), restaurantId: menu.restaurantId.toString() })));
    });
  });

  describe('getMenuById', () => {
    it('should return 404 if menu not found', async () => {
      Menu.findById.mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/menus/${menuId}`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Menu not found' });
    });

    it('should return the menu if found', async () => {
      const menu = { _id: menuId, name: 'Lunch Menu', restaurantId: restaurantId.toString() };
      Menu.findById.mockResolvedValue(menu);

      const res = await request(app)
        .get(`/api/menus/${menuId}`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ...menu, _id: menu._id.toString(), restaurantId: menu.restaurantId.toString() });
    });
  });

  describe('updateMenu', () => {
    it('should return 404 if menu not found', async () => {
      Menu.findById.mockResolvedValue(null);

      const res = await request(app)
        .put(`/api/menus/${menuId}`)
        .send({ name: 'Updated Menu' })
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Menu not found' });
    });

    it('should update the menu if found', async () => {
      const menu = { _id: menuId, name: 'Lunch Menu', restaurantId: restaurantId.toString() };
      Menu.findById.mockResolvedValue(menu);
      menu.save = jest.fn().mockResolvedValue({ ...menu, name: 'Updated Menu' });

      const res = await request(app)
        .put(`/api/menus/${menuId}`)
        .send({ name: 'Updated Menu' })
        .set('Authorization', `Bearer ${managerToken}`);

      const updatedMenu = { ...menu, name: 'Updated Menu' };
      delete updatedMenu.save; // Exclude the save function from the comparison

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ...updatedMenu, _id: updatedMenu._id.toString(), restaurantId: updatedMenu.restaurantId.toString() });
    });
  });

  describe('deleteMenu', () => {
    it('should return 404 if menu not found', async () => {
      Menu.findById.mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/menus/${menuId}`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Menu not found' });
    });

    it('should delete the menu if found', async () => {
      const menu = { _id: menuId, name: 'Lunch Menu', restaurantId: restaurantId.toString() };
      Menu.findById.mockResolvedValue(menu);

      const res = await request(app)
        .delete(`/api/menus/${menuId}`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Menu removed' });
    });
  });
});


