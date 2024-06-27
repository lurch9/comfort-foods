const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const mockUser = {
  _id: new ObjectId(),
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  city: 'Anytown',
  dateOfBirth: new Date('1990-01-01T00:00:00.000Z'), // Convert to Date object
  role: 'user',
  restaurantId: new ObjectId(),
};

const mockManager = {
  _id: new ObjectId(),
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'password123',
  city: 'Othertown',
  dateOfBirth: new Date('1985-05-05T00:00:00.000Z'), // Convert to Date object
  role: 'manager',
  restaurantId: new ObjectId(),
};

const protect = (req, res, next) => {
  req.user = mockUser;
  next();
};

const managerProtect = (req, res, next) => {
  req.user = mockManager;
  next();
};

module.exports = { protect, managerProtect, mockUser, mockManager };


  

  