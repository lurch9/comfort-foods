const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');

// Get manager's restaurant
const getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ manager: req.user._id });
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

// Create new restaurant
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, street, city, state, zip, contact } = req.body;

  const restaurant = new Restaurant({
    manager: req.user._id,
    name,
    address: {
      street,
      city,
      state,
      zip
    },
    contact
  });

  const createdRestaurant = await restaurant.save();
  res.status(201).json(createdRestaurant);
});

// Get restaurant by ID
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

// Update restaurant
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (restaurant) {
    restaurant.name = req.body.name || restaurant.name;
    restaurant.address.street = req.body.street || restaurant.address.street;
    restaurant.address.city = req.body.city || restaurant.address.city;
    restaurant.address.state = req.body.state || restaurant.address.state;
    restaurant.address.zip = req.body.zip || restaurant.address.zip;
    restaurant.contact = req.body.contact || restaurant.contact;

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

module.exports = {
  getMyRestaurant,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
};


  