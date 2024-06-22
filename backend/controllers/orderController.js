const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Get order by order ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Get order by session ID
const getOrderBySessionId = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  console.log('Looking for order with session ID:', sessionId);

  const order = await Order.findOne({ sessionId });  // Use sessionId here
  
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Get all orders for a user
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// Update the status of an order
const updateOrderStatus = asyncHandler(async (req, res) => {
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

// Get all orders for a manager's restaurant
const getRestaurantOrders = asyncHandler(async (req, res) => {
  const restaurantId = req.user.restaurantId;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    res.status(400).json({ message: 'Invalid restaurant ID' });
    return;
  }

  const orders = await Order.find({ restaurant: restaurantId });

  if (orders.length > 0) {
    res.json(orders);
  } else {
    res.status(404).json({ message: 'No orders found for this restaurant' });
  }
});

module.exports = {
  getOrderById,
  getOrderBySessionId,
  getUserOrders,
  updateOrderStatus,
  getRestaurantOrders,
};






