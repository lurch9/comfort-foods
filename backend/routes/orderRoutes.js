const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, total, subtotal, taxes, deliveryFee, shippingAddress, customer } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Validate product IDs and fetch products
    const orderItems = await Promise.all(
      items.map(async (item) => {
        if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
          throw new Error(`Invalid product ID: ${item.product}`);
        }
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        return {
          ...item,
          product: product._id,
          name: product.name,
          price: product.price,
        };
      })
    );

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      total,
      subtotal,
      taxes,
      deliveryFee,
      shippingAddress,
      status: 'Pending',
      customer: customer // Adding customer field
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get all orders for a user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name description price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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




























