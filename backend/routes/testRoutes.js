const express = require('express');
const Order = require('../models/Order'); // Adjust the path as necessary
const router = express.Router();

router.post('/addMockOrder', async (req, res) => {
  try {
    console.log('Trying to add the order: ', req.body);
    const mockOrder = req.body;
    const order = new Order(mockOrder);
    await order.save();
    console.log('Order saved successfully: ', order);
    res.status(201).json({ message: 'Mock order added successfully', orderId: order._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add mock order', error: error.message });
  }
});

module.exports = router;