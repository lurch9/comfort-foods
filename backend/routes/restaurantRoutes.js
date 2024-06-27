const express = require('express');
const {
  createRestaurant,
  getMyRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByProximity,
} = require('../controllers/restaurantController');
const { protect, managerProtect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/near').get(getRestaurantsByProximity);

router.route('/').post(managerProtect, createRestaurant);
router.route('/me').get(managerProtect, getMyRestaurant);

router.route('/:id')
  .get(managerProtect, (req, res, next) => {
    console.log('Route /:id accessed');
    next();
  }, getRestaurantById)
  .put(managerProtect, updateRestaurant)
  .delete(managerProtect, deleteRestaurant);

module.exports = router;













