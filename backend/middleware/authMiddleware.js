const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET); // Await jwt.verify

      const userId = decoded.id; // Corrected to use 'id'

      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Not authorized, token expired' });
      } else {
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  } else {
    console.error('No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

const managerProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);


      const userId = decoded.id; // Corrected to use 'id'


      const user = await User.findById(userId).select('-password'); // Correcting to 'id'

      if (!user || user.role !== 'manager') {
        res.status(401).json({ message: 'Not authorized as manager' });
        return;
      }

      req.user = user;


      next();
    } catch (error) {
      console.error('Error verifying token:', error);

      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Not authorized, token expired' });
      } else {
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  } else {
    console.error('No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protect, managerProtect };










