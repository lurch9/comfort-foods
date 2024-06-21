const express = require('express');
const { createPaymentIntent, createOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-checkout-session', protect, createPaymentIntent);
router.post('/create-order', protect, createOrder);

module.exports = router;