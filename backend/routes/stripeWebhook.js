const express = require('express');
const Order = require('../models/Order'); // Ensure correct path
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('Webhook endpoint hit'); // Add debug log

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Event verified:', event); // Add debug log
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout session completed:', session); // Add debug log

    const { customerId, restaurantId, items } = session.metadata;

    if (!restaurantId) {
      console.error("Restaurant ID not available");
      return res.status(400).send('Restaurant ID not available');
    }

    const parsedItems = JSON.parse(items);
    if (!parsedItems || parsedItems.length === 0) {
      console.error("Items not available or empty");
      return res.status(400).send('Items not available or empty');
    }

    // Check if the order already exists
    const existingOrder = await Order.findOne({ paymentIntentId: session.payment_intent });
    if (existingOrder) {
      console.log('Order already exists:', existingOrder);
      return res.status(200).send('Order already exists');
    }

    // Create order in database
    const order = new Order({
      user: customerId || undefined, // Use undefined if customerId is not available
      restaurant: restaurantId,
      items: parsedItems,
      total: session.amount_total / 100,
      paymentIntentId: session.payment_intent,
      sessionId: session.id, // Save session ID
      status: 'pending',
    });

    try {
      await order.save();
      console.log('Order created:', order);
      res.status(200).send('Received webhook');
    } catch (err) {
      console.error('Error saving order:', err);
      res.status(500).send('Error saving order');
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
    res.status(200).send('Received webhook');
  }
});

module.exports = router;











