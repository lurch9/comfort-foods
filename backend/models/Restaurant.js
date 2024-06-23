const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  }
});

addressSchema.index({ location: '2dsphere' });

const restaurantSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: addressSchema,
  contact: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;





