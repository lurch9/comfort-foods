// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, total, name, street, city, state, zip } = req.body;

    if (items && items.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const order = new Order({
      user: req.user._id,
      items,
      total,
      shippingAddress: { name, street, city, state, zip },
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get orders for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;





