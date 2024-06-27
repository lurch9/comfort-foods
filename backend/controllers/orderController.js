const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Get order by order ID
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('Attempting to fetch order: ', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
      console.log('Could not find order');
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log('Order: ', res.json(order));
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Get order by session ID
const getOrderBySessionId = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.params;
  console.log('Looking for order with session ID:', sessionId);

  const order = await Order.findOne({ sessionId });

  if (order) {
    console.log('Order found:', order);
    res.json(order);
  } else {
    console.log('Order not found');
    res.status(404).json({ message: 'Order not found' });
  }
});

const getUserOrders = asyncHandler(async (req, res, next) => {
  try {
    console.log('Fetching orders for user ID:', req.user._id);
    const orders = await Order.find({ user: req.user._id });
    console.log('Fetched orders:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    next(error);
  }
});

// Update the status of an order
const updateOrderStatus = asyncHandler(async (req, res, next) => {
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
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Get all orders for a manager's restaurant
const getRestaurantOrders = asyncHandler(async (req, res, next) => {
  const restaurantId = req.user.restaurantId;
  console.log('Restaurant ID:', restaurantId);

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    console.log('Invalid restaurant ID:', restaurantId);
    return res.status(400).json({ message: 'Invalid restaurant ID' });
  }

  try {
    const orders = await Order.find({ restaurant: restaurantId });
    console.log('Orders found:', orders);

    if (orders.length > 0) {
      res.json(orders);
    } else {
      res.status(404).json({ message: 'No orders found for this restaurant' });
    }
  } catch (error) {
    console.log('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

const getCompletedOrders = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(400).json({ message: 'Invalid restaurant ID' });
  }

  try {
    const completedOrders = await Order.find({ restaurant: restaurantId, status: 'completed' });

    if (completedOrders.length > 0) {
      res.json(completedOrders);
    } else {
      res.status(404).json({ message: 'No completed orders found for this restaurant' });
    }
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    res.status(500).json({ message: 'Error fetching completed orders' });
  }
});

module.exports = {
  getOrderById,
  getOrderBySessionId,
  getUserOrders,
  updateOrderStatus,
  getRestaurantOrders,
  getCompletedOrders,
};








