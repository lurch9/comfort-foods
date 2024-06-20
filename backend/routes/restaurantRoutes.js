const express = require('express');
const {
  createRestaurant,
  getMyRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByZip,
} = require('../controllers/restaurantController');
const { protect, managerProtect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/zip').get((req, res, next) => {
  console.log('Route /zip accessed');
  next();
}, getRestaurantsByZip);

router.route('/').post(protect, managerProtect, createRestaurant);
router.route('/me').get(protect, managerProtect, getMyRestaurant);

router.route('/:id')
  .get(protect, managerProtect, (req, res, next) => {
    console.log('Route /:id accessed');
    next();
  }, getRestaurantById)
  .put(protect, managerProtect, updateRestaurant)
  .delete(protect, managerProtect, deleteRestaurant);

module.exports = router;













