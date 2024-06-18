// models/Menu.js
const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

const menuSchema = mongoose.Schema({
  name: { type: String, required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [menuItemSchema],
}, {
  timestamps: true,
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;

