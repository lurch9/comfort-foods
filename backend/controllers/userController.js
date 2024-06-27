const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Register a new user or manager
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, street, city, state, zip, dateOfBirth, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
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
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const tokenExpiration = rememberMe ? '30d' : '15m';
      const token = generateToken(user._id, tokenExpiration);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : null, // 30 days or session
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
});

const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
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
        role: user.role,
        restaurantId: user.restaurantId,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
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
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};



