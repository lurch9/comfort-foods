const mongoose = require('mongoose');
const fs = require('fs');

// Connect to MongoDB (ensure your MongoDB server is running)
mongoose.connect('mongodb://localhost:27017/your_db_name', { useNewUrlParser: true, useUnifiedTopology: true });

const ObjectId = mongoose.Types.ObjectId;

const mockMenu1 = [
  {
    product: new ObjectId(), // Automatically generate ObjectId
    name: 'Pepperoni Pizza',
    description: 'Delicious pepperoni pizza with cheese',
    price: 12.99,
  },
  {
    product: new ObjectId(), // Automatically generate ObjectId
    name: 'Cheese Pizza',
    description: 'Classic cheese pizza with mozzarella',
    price: 10.99,
  },
];

const mockMenu2 = [
  {
    product: new ObjectId(), // Automatically generate ObjectId
    name: 'Veggie Pizza',
    description: 'Pizza loaded with vegetables',
    price: 11.99,
  },
  {
    product: new ObjectId(), // Automatically generate ObjectId
    name: 'BBQ Chicken Pizza',
    description: 'Pizza with BBQ chicken',
    price: 13.99,
  },
];

// Write mock data to JSON files
fs.writeFileSync('../src/mockData/mockMenu1.json', JSON.stringify(mockMenu1, null, 2));
fs.writeFileSync('../src/mockData/mockMenu2.json', JSON.stringify(mockMenu2, null, 2));

console.log('Mock data generated successfully!');
mongoose.disconnect();
