// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');
const Product = require('./models/Product');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await Restaurant.deleteMany();
    await Menu.deleteMany();
    await Product.deleteMany();

    // Create sample restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Pizza Place',
        address: {
          street: '123 Main St',
          city: 'Somewhere',
          state: 'CA',
          zip: '12345',
        },
        contact: '123-456-7890',
      },
      {
        name: 'Burger Joint',
        address: {
          street: '456 Elm St',
          city: 'Anywhere',
          state: 'TX',
          zip: '67890',
        },
        contact: '987-654-3210',
      },
      {
        name: 'Sushi Spot',
        address: {
          street: '789 Oak St',
          city: 'Everywhere',
          state: 'NY',
          zip: '11223',
        },
        contact: '555-123-4567',
      },
      // Add more restaurants as needed
    ]);

    // Create sample products
    const products = await Product.insertMany([
      // Pizza Place
      {
        name: 'Pepperoni Pizza',
        description: 'Delicious pepperoni pizza with cheese',
        price: 12.99,
        restaurant: restaurants[0]._id,
      },
      {
        name: 'Cheese Pizza',
        description: 'Classic cheese pizza with mozzarella',
        price: 10.99,
        restaurant: restaurants[0]._id,
      },
      {
        name: 'Veggie Pizza',
        description: 'Pizza loaded with vegetables',
        price: 11.99,
        restaurant: restaurants[0]._id,
      },
      {
        name: 'BBQ Chicken Pizza',
        description: 'Pizza with BBQ chicken',
        price: 13.99,
        restaurant: restaurants[0]._id,
      },
      // Burger Joint
      {
        name: 'Cheeseburger',
        description: 'Juicy burger with cheese',
        price: 8.99,
        restaurant: restaurants[1]._id,
      },
      {
        name: 'Bacon Burger',
        description: 'Burger with crispy bacon',
        price: 9.99,
        restaurant: restaurants[1]._id,
      },
      {
        name: 'Veggie Burger',
        description: 'Delicious veggie burger',
        price: 7.99,
        restaurant: restaurants[1]._id,
      },
      {
        name: 'Double Burger',
        description: 'Double patty burger',
        price: 10.99,
        restaurant: restaurants[1]._id,
      },
      // Sushi Spot
      {
        name: 'California Roll',
        description: 'Sushi roll with crab and avocado',
        price: 6.99,
        restaurant: restaurants[2]._id,
      },
      {
        name: 'Spicy Tuna Roll',
        description: 'Sushi roll with spicy tuna',
        price: 7.99,
        restaurant: restaurants[2]._id,
      },
      {
        name: 'Salmon Nigiri',
        description: 'Sushi with salmon on top',
        price: 8.99,
        restaurant: restaurants[2]._id,
      },
      {
        name: 'Eel Roll',
        description: 'Sushi roll with eel and cucumber',
        price: 9.99,
        restaurant: restaurants[2]._id,
      },
      // Add more products as needed
    ]);

    // Create sample menus
    await Menu.insertMany([
      {
        restaurant: restaurants[0]._id,
        items: products.filter(product => product.restaurant.toString() === restaurants[0]._id.toString()).map(product => product._id),
      },
      {
        restaurant: restaurants[1]._id,
        items: products.filter(product => product.restaurant.toString() === restaurants[1]._id.toString()).map(product => product._id),
      },
      {
        restaurant: restaurants[2]._id,
        items: products.filter(product => product.restaurant.toString() === restaurants[2]._id.toString()).map(product => product._id),
      },
      // Add more menus as needed
    ]);

    console.log('Data seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();