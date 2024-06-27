const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const GEOCODE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

const createRestaurant = asyncHandler(async (req, res) => {
  const { name, street, city, state, zip, contact } = req.body;

  console.log('Received data:', { name, street, city, state, zip, contact });

  const geocodeResponse = await fetch(`${GEOCODE_API_URL}?address=${street},${city},${state},${zip}&key=${GEOCODE_API_KEY}`);
  const geocodeData = await geocodeResponse.json();

  console.log('Geocode API response:', geocodeData);

  if (geocodeData.status !== 'OK') {
    return res.status(400).json({ message: 'Invalid address' });
  }

  const location = geocodeData.results[0].geometry.location;
  const { lat, lng } = location;

  const restaurant = new Restaurant({
    name,
    address: {
      street,
      city,
      state,
      zip,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    },
    contact,
    manager: req.user._id,
  });

  const createdRestaurant = await restaurant.save();
  console.log('Created restaurant:', createdRestaurant);

  if (req.user.role === 'manager') {
    req.user.restaurantId = createdRestaurant._id;
    await req.user.save();
    await User.findByIdAndUpdate(req.user._id, { restaurantId: createdRestaurant._id });
  }

  res.status(201).json(createdRestaurant);
});

const getMyRestaurant = asyncHandler(async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ manager: req.user._id });
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    next(error);
  }
});

const deleteRestaurant = asyncHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    console.log('Restaurant found:', restaurant);
    console.log('Requesting user:', req.user );

    if (restaurant) {
      if (!req.user || !req.user._id || !restaurant.manager) {
        throw new Error('Invalid request');
      }

      if (restaurant.manager.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized to delete this restaurant' });
      } else {
        await Restaurant.deleteOne({ _id: req.params.id });
        req.user.restaurantId = null;
        await req.user.save();
        res.json({ message: 'Restaurant removed' });
      }
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error('Error in deleteRestaurant:', error);
    throw error;
  }
});

const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

const getRestaurantsByProximity = asyncHandler(async (req, res) => {
  const { lat, lon, maxDistance = 5000 } = req.query;

  try {
    const restaurants = await Restaurant.find({
      'address.location': {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    if (restaurants.length > 0) {
      res.json(restaurants);
    } else {
      res.status(404).json({ message: 'No restaurants found near the provided location.' });
    }
  } catch (error) {
    console.error('Error fetching restaurants by proximity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

module.exports = {
  deleteRestaurant,
  getMyRestaurant,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  getRestaurantsByProximity,
};




  