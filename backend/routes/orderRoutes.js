const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const io = require('../server'); // Import the io instance

// Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, total, name, street, city, state, zip } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    console.log('Received items:', items);

    // Validate product IDs
    const orderItems = items.map(item => {
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        console.error('Invalid product ID:', item.product);
        throw new Error(`Invalid product ID: ${item.product}`);
      }
      return {
        ...item,
        product: new mongoose.Types.ObjectId(item.product)
      };
    });

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      total,
      shippingAddress: { name, street, city, state, zip },
      status: 'Pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all orders for a user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update the status of an order
router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save({ validateModifiedOnly: true });

      // Emit an event to notify clients about the status update
      req.io.emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.status,
      });

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;


















