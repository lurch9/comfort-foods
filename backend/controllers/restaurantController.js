const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');

// Create a new restaurant
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, street, city, state, zip, contact } = req.body;

  const restaurant = await Restaurant.create({
    name,
    address: {
      street,
      city,
      state,
      zip,
    },
    contact,
    manager: req.user._id, // Assuming the manager is the logged-in user
  });

  if (restaurant) {
    res.status(201).json(restaurant);
  } else {
    res.status(400);
    throw new Error('Invalid restaurant data');
  }
});

const getRestaurantForManager = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ manager: req.user._id });
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

module.exports = { createRestaurant, getRestaurantForManager };



  