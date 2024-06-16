const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');
const Product = require('./models/Product');

dotenv.config();
connectDB();

const purgeData = async () => {
  try {
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    await Product.deleteMany({});
    console.log('Restaurants, menus, and products purged successfully');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

purgeData();
