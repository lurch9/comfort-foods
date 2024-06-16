const Product = require('../models/Product');
const Restaurant = require('../models/Restaurant');
const asyncHandler = require('express-async-handler');

// Add new product to menu
const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const restaurantId = req.params.restaurantId;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  // Verify that the logged-in user is the manager of the restaurant
  if (restaurant.manager.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add products to this restaurant');
  }

  const product = new Product({
    name,
    description,
    price,
    restaurant: restaurantId,
  });

  const createdProduct = await product.save();
  restaurant.menu.push(createdProduct._id);
  await restaurant.save();

  res.status(201).json(createdProduct);
});

// Remove product from menu
const removeProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const restaurant = await Restaurant.findById(product.restaurant);

  // Verify that the logged-in user is the manager of the restaurant
  if (restaurant.manager.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to remove products from this restaurant');
  }

  await product.remove();
  restaurant.menu = restaurant.menu.filter(item => item.toString() !== productId);
  await restaurant.save();

  res.json({ message: 'Product removed' });
});

// Get all products for a restaurant
const getMenu = asyncHandler(async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const products = await Product.find({ restaurant: restaurantId });
  res.json(products);
});

module.exports = { addProduct, removeProduct, getMenu };




