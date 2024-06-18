// restaurantRoutes.js
const express = require('express');
const {
  createRestaurant,
  getMyRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurantController');
const { protect, managerProtect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, managerProtect, createRestaurant);
router.route('/me').get(protect, managerProtect, getMyRestaurant);
router.route('/:id')
  .get(protect, managerProtect, getRestaurantById)
  .put(protect, managerProtect, updateRestaurant)
  .delete(protect, managerProtect, deleteRestaurant);

module.exports = router;






