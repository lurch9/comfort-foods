// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes'); // Import the restaurant routes
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api', restaurantRoutes); // Use the restaurant routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
