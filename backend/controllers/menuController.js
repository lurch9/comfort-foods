// controllers/menuController.js
const asyncHandler = require('express-async-handler');
const Menu = require('../models/Menu');

// Create a new menu
const createMenu = asyncHandler(async (req, res) => {
  const { name, restaurantId } = req.body;

  const menu = new Menu({
    name,
    restaurant: restaurantId,
    items: [],
  });

  const createdMenu = await menu.save();
  res.status(201).json(createdMenu);
});

// Get all menus for a specific restaurant
const getMenusByRestaurant = asyncHandler(async (req, res) => {
  const menus = await Menu.find({ restaurant: req.params.restaurantId });
  res.json(menus);
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
    await menu.remove();
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





