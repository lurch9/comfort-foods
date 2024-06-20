const express = require('express');
const {
  createMenu,
  getMenusByRestaurant,
  getMenuById,
  updateMenu,
  deleteMenu,
} = require('../controllers/menuController');
const { protect, managerProtect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, managerProtect, createMenu);
router.route('/restaurant/:restaurantId').get(getMenusByRestaurant);
router.route('/:id')
  .get(getMenuById)
  .put(protect, managerProtect, updateMenu)
  .delete(protect, managerProtect, deleteMenu);

module.exports = router;









