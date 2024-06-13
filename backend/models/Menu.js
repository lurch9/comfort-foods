// backend/models/Menu.js
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
