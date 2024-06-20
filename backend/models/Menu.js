const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
  name: { type: String, required: true },
  items: [{ 
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
  }],
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }, // Ensure restaurantId is used
}, {
  timestamps: true,
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;


