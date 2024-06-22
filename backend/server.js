const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');
const stripeWebhook = require('./routes/stripeWebhook');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Change this to your frontend URL
    methods: ["GET", "POST", "PUT"],
  },
});

// Make io accessible in request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Enable CORS for all routes
app.use(cors());
console.log('CORS enabled');

// Enable JSON body parser with raw body extraction for Stripe webhook
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/webhook')) {
      req.rawBody = buf.toString();
    }
  }
}));
console.log('JSON middleware with raw body parser enabled');

app.use('/api/users', userRoutes);
console.log('User routes registered');
app.use('/api/restaurants', restaurantRoutes);
console.log('Restaurant routes registered');
app.use('/api/orders', orderRoutes);
console.log('Order routes registered');
app.use('/api/menus', menuRoutes);
console.log('Menu routes registered');
app.use('/api/webhook', stripeWebhook);
console.log('Stripe webhook route registered');

// Serve static files from the dist directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
  );
}

// Place the error handler after all other middleware and routes
app.use(errorHandler);
console.log('Error handler middleware registered');

app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log("Create checkout session endpoint hit");
    const { items, customerId, restaurantId } = req.body;
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: lineItems,
      mode: 'payment',
      return_url: `${process.env.CLIENT_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
      metadata: {
        customerId: customerId || '',
        restaurantId: restaurantId,
        items: JSON.stringify(items)
      }
    });
    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

import io from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('Connected to WebSocket');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket');
});

export default socket;













