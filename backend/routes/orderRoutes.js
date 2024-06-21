const express = require('express');
const router = express.Router();
const { protect, managerProtect } = require('../middleware/authMiddleware');
const { 
  getOrderBySessionId, 
  getOrderById, 
  updateOrderStatus, 
  getUserOrders, 
  getRestaurantOrders 
} = require('../controllers/orderController');

// Get all orders for a user
router.get('/', protect, getUserOrders);

// Get all orders for a manager's restaurant (Place this route before the dynamic :id route)
router.get('/restaurant', managerProtect, getRestaurantOrders);

// Get order by session ID (for order confirmation)
router.get('/confirmation/:sessionId', getOrderBySessionId);

// Get order by order ID
router.get('/:id', getOrderById);

// Update the status of an order
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
































