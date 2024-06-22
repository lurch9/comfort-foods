// controllers/menuController.js
const asyncHandler = require('express-async-handler');
const Menu = require('../models/Menu');

const createMenu = asyncHandler(async (req, res) => {
  const { name, restaurantId } = req.body;

  if (!restaurantId) {
    res.status(400);
    throw new Error('Restaurant ID is required');
  }

  const menu = new Menu({
    name,
    restaurantId,
    items: [],
  });

  const createdMenu = await menu.save();
  res.status(201).json(createdMenu);
});

const getMenusByRestaurant = asyncHandler(async (req, res) => {
  const restaurantId = req.params.restaurantId;
  console.log(`Fetching menus for restaurant ID: ${restaurantId}`);

  try {
    const menus = await Menu.find({ restaurantId: restaurantId });
    if (menus.length === 0) {
      console.log(`No menus found for restaurant ID: ${restaurantId}`);
      res.status(404).json({ message: 'Menus not found' });
    } else {
      console.log(`Found menus: ${JSON.stringify(menus)}`);
      res.json(menus);
    }
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get menu by ID
const getMenuById = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (menu) {
    res.json(menu);
  } else {
    res.status(404);
    throw new Error('Menu not found');
  }
});

// Update menu
const updateMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (menu) {
    menu.name = req.body.name || menu.name;

    if (req.body.items) {
      menu.items = req.body.items;
    }

    const updatedMenu = await menu.save();
    res.json(updatedMenu);
  } else {
    res.status(404);
    throw new Error('Menu not found');
  }
});

// Delete menu
const deleteMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (menu) {
    await Menu.deleteOne({ _id: req.params.id }); // Updated to use deleteOne
    res.json({ message: 'Menu removed' });
  } else {
    res.status(404);
    throw new Error('Menu not found');
  }
});

module.exports = {
  createMenu,
  getMenusByRestaurant,
  getMenuById,
  updateMenu,
  deleteMenu,
};





