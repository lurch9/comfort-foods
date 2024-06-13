const express = require('express');
const mongoose = require('mongoose');
const Menu = require('../models/Menu');
const router = express.Router();

// Get menu by restaurant ID
router.get('/:restaurantId', async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const menu = await Menu.findOne({ restaurant: restaurantId }).populate('items');
    if (menu) {
      res.json(menu.items);
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

module.exports = router;



