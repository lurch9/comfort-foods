import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import '../Styles/Checkout.css'; // Make sure you have a CSS file for styling

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <div className="checkout-container">
      <h2>Checkout</h2>
      <CheckoutForm />
    </div>
  </Elements>
);

export default Checkout;


























