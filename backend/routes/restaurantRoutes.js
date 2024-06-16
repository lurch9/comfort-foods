const express = require('express');
const { createRestaurant, getRestaurantForManager } = require('../controllers/restaurantController');
const { restaurantProtect } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new restaurant
router.post('/', restaurantProtect, createRestaurant);
router.get('/me', restaurantProtect, getRestaurantForManager);

module.exports = router;


