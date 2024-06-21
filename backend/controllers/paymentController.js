// controllers/paymentController.js

const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const Order = require('../models/Order');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { items, total } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 100, // Stripe works with cents
    currency: 'usd',
  });

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const { items, total, paymentIntentId, restaurantId, deliveryAddress } = req.body;
  const userId = req.user._id;

  const order = new Order({
    user: userId,
    restaurant: restaurantId,
    items,
    total,
    paymentIntentId,
    status: 'pending',
    deliveryAddress,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

module.exports = {
  createPaymentIntent,
  createOrder,
};
