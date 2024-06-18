const express = require('express');
const {
  createRestaurant,
  getMyRestaurant,
  getRestaurantById,
  updateRestaurant,
} = require('../controllers/restaurantController');
const { protect, managerProtect } = require('../middleware/authMiddleware');
const router = express.Router();

console.log('Imported functions:', { createRestaurant, getMyRestaurant, getRestaurantById, updateRestaurant });
console.log('Imported middleware:', { protect, managerProtect });

router.route('/').post(protect, managerProtect, createRestaurant);
router.route('/me').get(protect, managerProtect, getMyRestaurant);
router.route('/:id').get(protect, managerProtect, getRestaurantById).put(protect, managerProtect, updateRestaurant);

module.exports = router;





