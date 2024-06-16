const express = require('express');
const { addProduct, removeProduct, getMenu } = require('../controllers/menuController');
const { restaurantProtect } = require('../middleware/authMiddleware');
const router = express.Router();

// Only managers can add or remove products to/from the menu
router.post('/:restaurantId', restaurantProtect, addProduct);
router.delete('/:productId', restaurantProtect, removeProduct);
router.get('/:restaurantId', getMenu);

module.exports = router;






