const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');

// Create a new restaurant
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, street, city, state, zip, contact } = req.body;
  const restaurant = new Restaurant({
    name,
    address: { street, city, state, zip },
    contact,
    manager: req.user._id,
  });

  const createdRestaurant = await restaurant.save();

  // Update the user with the restaurant ID if the user is a manager
  if (req.user.role === 'manager') {
    req.user.restaurantId = createdRestaurant._id;
    await req.user.save();
  }

  res.status(201).json(createdRestaurant);
});

// Get the manager's restaurant
const getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ manager: req.user._id });
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    // Only the manager of the restaurant can delete it
    if (restaurant.manager.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this restaurant');
    }

    await Restaurant.deleteOne({ _id: req.params.id });

    // Clear the restaurantId field of the user
    req.user.restaurantId = null;
    await req.user.save();

    res.json({ message: 'Restaurant removed' });
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
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
  deleteRestaurant,
  getMyRestaurant,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
};


  