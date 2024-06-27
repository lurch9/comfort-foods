const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Import the path module
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');
const stripeWebhook = require('./routes/stripeWebhook');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Add this line
const testRoutes = require('./routes/testRoutes');
const http = require('http');
const { Server } = require('socket.io');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();
// Connect to the appropriate database based on the environment
const dbURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
connectDB(dbURI);
console.log('dbURI: ', dbURI);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Change this to your frontend URL
    methods: ["GET", "POST", "PUT"],
  },
});

app.use(cors());
app.use(cookieParser()); // Add this line
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/webhook')) {
      req.rawBody = buf.toString();
    }
  }
}));

// Attach io to req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

if (process.env.NODE_ENV = 'test') {
  app.use('/api/test', testRoutes);
}
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/webhook', stripeWebhook);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
  );
}

app.post('/create-checkout-session', async (req, res) => {
  console.log('Creating checkout session');
  try {
    const { items, customerId, restaurantId } = req.body;
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
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
      metadata: { customerId: customerId || '', restaurantId: restaurantId, items: JSON.stringify(items) }
    });
    res.send({ clientSecret: session.client_secret });
  } catch (error) {
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


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


















