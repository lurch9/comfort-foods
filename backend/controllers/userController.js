const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Register a new user or manager
const registerUser = asyncHandler(async (req, res) => {
  console.log('Received registration data:', req.body); // Log the incoming request data
  const { name, email, password, street, city, state, zip, dateOfBirth, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    street,
    city,
    state,
    zip,
    dateOfBirth,
    role, // 'user' or 'manager'
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Ensure role is included
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      street: user.street,
      city: user.city,
      state: user.state,
      zip: user.zip,
      dateOfBirth: user.dateOfBirth,
      role:user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.street = req.body.street || user.street;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.zip = req.body.zip || user.zip;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      street: updatedUser.street,
      city: updatedUser.city,
      state: updatedUser.state,
      zip: updatedUser.zip,
      dateOfBirth: updatedUser.dateOfBirth,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};


