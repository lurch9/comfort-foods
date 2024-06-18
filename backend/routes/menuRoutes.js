const express = require('express');
const { addProduct, removeProduct, getMenu } = require('../controllers/menuController');
const { managerProtect } = require('../middleware/authMiddleware');
const router = express.Router();

// Only managers can add or remove products to/from the menu
router.post('/:restaurantId', managerProtect, addProduct);
router.delete('/:productId', managerProtect, removeProduct);
router.get('/:restaurantId', getMenu);

module.exports = router;






